import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, provider, db } from '../firebase/config'

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
                favoriteFlavorr: null,
            }
            await setDoc(ref, newProfile)
            setProfile(newProfile)
        }
    }

    // Login con Google
    async function loginWithGoogle() {
        try {
            await signInWithPopup(auth, provider)
        } catch (err) {
            console.error('Login error:', err)
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