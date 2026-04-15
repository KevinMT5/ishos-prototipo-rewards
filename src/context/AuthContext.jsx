import { createContext, useContext, useEffect, useState } from 'react'
// 1. Agregamos las importaciones necesarias de Firebase Auth y Capacitor
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, provider, db } from '../firebase/config'
import { Capacitor } from '@capacitor/core'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Escucha cambios de sesión
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser)
                await loadProfile(firebaseUser.uid, firebaseUser)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })
        return unsub
    }, [])

    // Carga o crea perfil en Firestore
    async function loadProfile(uid, firebaseUser) {
        const ref = doc(db, 'users', uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
            setProfile(snap.data())
        } else {
            // Primera vez: crear perfil con 0 puntos
            const newProfile = {
                uid,
                name: firebaseUser.displayName || 'Cliente',
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || null,
                points: 0,
                level: 'Bronce',
                visits: 0,
                joinedAt: serverTimestamp(),
                favoriteFlavor: null, // (Corregí un pequeño error tipográfico aquí que decía 'favoriteFlavorr')
            }
            await setDoc(ref, newProfile)
            setProfile(newProfile)
        }
    }

    // 2. Modificamos el Login con Google para que sea híbrido (Web / Android)
    async function loginWithGoogle() {
        try {
            const platform = Capacitor.getPlatform()

            if (platform === 'android' || platform === 'ios') {
                // 📱 RUTA NATIVA (Para el celular)
                await GoogleAuth.initialize({
                    clientId: '948193083003-o2b78hm417i4mlhhr25vqijrladm8s1k.apps.googleusercontent.com',
                    scopes: ['profile', 'email'],
                    grantOfflineAccess: true,
                })
                
                const googleUser = await GoogleAuth.signIn()
                const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken)
                await signInWithCredential(auth, credential)

            } else {
                // 💻 RUTA WEB (Para la computadora)
                await signInWithPopup(auth, provider)
            }
        } catch (err) {
            console.error('Login error:', err)
            // Agregamos una alerta para que si falla en el celular, nos diga por qué
            alert("Error al iniciar sesión: " + JSON.stringify(err))
        }
    }

    // Cerrar sesión
    async function logout() {
        await signOut(auth)
    }

    // Refresca el perfil desde Firestore
    async function refreshProfile() {
        if (!user) return
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) setProfile(snap.data())
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}