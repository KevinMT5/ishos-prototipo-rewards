import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function History() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        async function load() {
            try {
                const q = query(
                    collection(db, 'transactions'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc'),
                    limit(30)
                )
                const snap = await getDocs(q)
                setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user])

    // Datos de ejemplo si no hay transacciones reales aún
    const DEMO = [
        { id: '1', type: 'earn', description: 'Mango con Chile + Granola', points: 25, createdAt: { toDate: () => new Date('2026-04-12') } },
        { id: '2', type: 'earn', description: 'Pitahaya Rosa (Vaso Grande)', points: 35, createdAt: { toDate: () => new Date('2026-04-10') } },
        { id: '3', type: 'redeem', description: 'Canjeaste: Topping Premium', points: -80, createdAt: { toDate: () => new Date('2026-04-08') } },
        { id: '4', type: 'earn', description: 'Taro Mágico + Frutas Frescas', points: 30, createdAt: { toDate: () => new Date('2026-04-05') } },
        { id: '5', type: 'earn', description: 'Fresa Natural', points: 20, createdAt: { toDate: () => new Date('2026-04-02') } },
        { id: '6', type: 'earn', description: 'Jabuticaba (2 vasos)', points: 50, createdAt: { toDate: () => new Date('2026-03-28') } },
    ]

    const data = transactions.length > 0 ? transactions : DEMO

    function formatDate(ts) {
        try {
            const d = ts?.toDate ? ts.toDate() : new Date(ts)
            return d.toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })
        } catch { return '—' }
    }

    return (
        <div style={{ padding: '16px' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '28px', fontWeight: '700', color: '#1C1917', marginBottom: '4px' }}>
                Historial
            </h1>
            <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '16px' }}>
                Tus visitas y canjes recientes
            </p>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#A8A29E' }}>Cargando...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.map(tx => {
                        const isEarn = tx.type === 'earn'
                        return (
                            <div
                                key={tx.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '14px',
                                    padding: '14px 16px',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        flexShrink: 0,
                                        background: isEarn ? '#E8F8F5' : '#FFF4EC',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                    }}>
                                        {isEarn ? '🍧' : '🎁'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1C1917', marginBottom: '1px' }}>
                                            {tx.description}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#A8A29E' }}>
                                            {formatDate(tx.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: isEarn ? '#2BBFAA' : '#FF8C42',
                                    flexShrink: 0,
                                    marginLeft: '8px',
                                }}>
                                    {isEarn ? '+' : ''}{tx.points}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}