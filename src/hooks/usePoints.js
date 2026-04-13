import { doc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function usePoints() {
    const { user, profile, refreshProfile } = useAuth()

    // Calcula el nivel según los puntos
    function calcLevel(pts) {
        if (pts >= 600) return 'Diamante'
        if (pts >= 300) return 'Oro'
        if (pts >= 100) return 'Plata'
        return 'Bronce'
    }

    // Puntos que faltan para el siguiente nivel
    function pointsToNext(pts) {
        if (pts < 100) return 100 - pts
        if (pts < 300) return 300 - pts
        if (pts < 600) return 600 - pts
        return 0
    }

    // Agrega puntos por una compra (llama desde el panel admin o QR scan)
    async function addPoints(amount, description = 'Compra en tienda') {
        if (!user) return

        const userRef = doc(db, 'users', user.uid)
        const newPts = (profile?.points || 0) + amount
        const newLevel = calcLevel(newPts)

        await updateDoc(userRef, {
            points: increment(amount),
            level: newLevel,
            visits: increment(1),
        })

        await addDoc(collection(db, 'transactions'), {
            userId: user.uid,
            type: 'earn',
            points: amount,
            description,
            createdAt: serverTimestamp(),
        })

        await refreshProfile()
    }

    // Canjea un premio
    async function redeemReward(reward) {
        if (!user) return { success: false, error: 'No autenticado' }
        if ((profile?.points || 0) < reward.pts) {
            return { success: false, error: 'Puntos insuficientes' }
        }

        const userRef = doc(db, 'users', user.uid)
        const newPts = (profile?.points || 0) - reward.pts
        const newLevel = calcLevel(newPts)

        await updateDoc(userRef, {
            points: increment(-reward.pts),
            level: newLevel,
        })

        await addDoc(collection(db, 'redemptions'), {
            userId: user.uid,
            rewardId: reward.id,
            rewardName: reward.name,
            pointsUsed: reward.pts,
            createdAt: serverTimestamp(),
        })

        await addDoc(collection(db, 'transactions'), {
            userId: user.uid,
            type: 'redeem',
            points: -reward.pts,
            description: `Canjeaste: ${reward.name}`,
            createdAt: serverTimestamp(),
        })

        await refreshProfile()
        return { success: true }
    }

    return {
        points: profile?.points || 0,
        level: profile?.level || 'Bronce',
        pointsToNext: pointsToNext(profile?.points || 0),
        nextLevel: calcLevel((profile?.points || 0) + 1),
        calcLevel,
        addPoints,
        redeemReward,
    }
}