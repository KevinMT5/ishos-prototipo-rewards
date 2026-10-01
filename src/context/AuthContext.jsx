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
        const rewardCode = `ISHOS-${uid.slice(0, 8).toUpperCase()}`

        if (snap.exists()) {
            const existingProfile = snap.data()
            setProfile({ ...existingProfile, rewardCode })

            // Migra perfiles existentes para que el panel del personal pueda
            // localizar al cliente usando el código corto que ve en la app.
            if (existingProfile.rewardCode !== rewardCode) {
                setDoc(ref, { rewardCode }, { merge: true }).catch((err) => {
                    console.error('No se pudo guardar el código de recompensas:', err)
                })
            }
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
                rewardCode,
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
            return { success: false, error: err }
        }

        return { success: true }
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

    // Actualiza únicamente la información personal editable del cliente.
    async function saveProfile(changes) {
        if (!user) return { success: false, error: 'No autenticado' }

        const allowed = ['name', 'phone', 'birthDate', 'contactEmail', 'photoURL', 'favoriteFlavor']
        const cleanChanges = Object.fromEntries(
            Object.entries(changes).filter(([key]) => allowed.includes(key))
        )

        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...cleanChanges,
                updatedAt: serverTimestamp(),
            }, { merge: true })
            setProfile(current => ({ ...current, ...cleanChanges }))
            return { success: true }
        } catch (error) {
            console.error('No se pudo actualizar el perfil:', error)
            return { success: false, error }
        }
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, refreshProfile, saveProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
