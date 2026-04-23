import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { IceCreamBowl, Gift, TrendingUp, TrendingDown } from 'lucide-react'

const DEMO = [
    { id: '1', type: 'earn',   description: 'Mango con Chile + Granola',      points: 25,  createdAt: { toDate: () => new Date('2026-04-12') } },
    { id: '2', type: 'earn',   description: 'Pitahaya Rosa (Vaso Grande)',     points: 35,  createdAt: { toDate: () => new Date('2026-04-10') } },
    { id: '3', type: 'redeem', description: 'Canjeaste: Topping Premium',      points: -80, createdAt: { toDate: () => new Date('2026-04-08') } },
    { id: '4', type: 'earn',   description: 'Taro Mágico + Frutas Frescas',   points: 30,  createdAt: { toDate: () => new Date('2026-04-05') } },
    { id: '5', type: 'earn',   description: 'Fresa Natural',                  points: 20,  createdAt: { toDate: () => new Date('2026-04-02') } },
    { id: '6', type: 'earn',   description: 'Jabuticaba (2 vasos)',            points: 50,  createdAt: { toDate: () => new Date('2026-03-28') } },
]

function formatDate(ts) {
    try {
        const d = ts?.toDate ? ts.toDate() : new Date(ts)
        return d.toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '—' }
}

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

    const data = transactions.length > 0 ? transactions : DEMO

    const totalGanado  = data.filter(t => t.type === 'earn').reduce((a, t) => a + t.points, 0)
    const totalCanjeado = Math.abs(data.filter(t => t.type === 'redeem').reduce((a, t) => a + t.points, 0))

    return (
        <div style={{
            padding: '16px',
            paddingBottom: '100px',
            background: '#FFFBF5',
            minHeight: '100dvh',
        }}>

            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px', fontWeight: '700',
                    color: '#1C1917', marginBottom: '4px',
                }}>
                    Historial
                </h1>
                <p style={{ fontSize: '13px', color: '#78716C' }}>
                    Tus visitas y canjes recientes
                </p>
            </div>

            {/* ── Stats resumen ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Puntos ganados', val: `+${totalGanado}`, icon: TrendingUp,   tint: 'rgba(43,191,170,0.08)',  border: 'rgba(43,191,170,0.18)',  accent: '#2BBFAA' },
                    { label: 'Puntos canjeados', val: `-${totalCanjeado}`, icon: TrendingDown, tint: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.18)',  accent: '#FF8C42' },
                ].map((s, i) => {
                    const Icon = s.icon
                    return (
                        <div key={i} style={{
                            background: s.tint,
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: `1px solid ${s.border}`,
                            borderRadius: '20px',
                            padding: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                                borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                            }} />
                            <Icon size={18} color={s.accent} strokeWidth={2} style={{ marginBottom: '8px' }} />
                            <p style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '24px', fontWeight: '700',
                                color: s.accent, lineHeight: 1, marginBottom: '4px',
                            }}>
                                {s.val}
                            </p>
                            <p style={{ fontSize: '11px', color: '#78716C', fontWeight: '500' }}>
                                {s.label}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* ── Lista de transacciones ── */}
            {loading ? (
                <div style={{
                    textAlign: 'center', padding: '40px 0',
                    color: '#A8A29E', fontSize: '14px',
                }}>
                    Cargando...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.map((tx, i) => {
                        const isEarn = tx.type === 'earn'
                        const Icon   = isEarn ? IceCreamBowl : Gift
                        return (
                            <div
                                key={tx.id}
                                style={{
                                    background: 'rgba(255,255,255,0.7)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '18px',
                                    padding: '14px 16px',
                                    border: '1px solid rgba(255,255,255,0.85)',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                                }}
                            >
                                {/* Highlight */}
                                <div style={{
                                    position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                                    borderRadius: '18px 18px 0 0', pointerEvents: 'none',
                                }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                    {/* Ícono */}
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '12px',
                                        flexShrink: 0,
                                        background: isEarn ? 'rgba(43,191,170,0.1)' : 'rgba(255,140,66,0.1)',
                                        border: `1px solid ${isEarn ? 'rgba(43,191,170,0.2)' : 'rgba(255,140,66,0.2)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                                    }}>
                                        <Icon
                                            size={18}
                                            color={isEarn ? '#2BBFAA' : '#FF8C42'}
                                            strokeWidth={2}
                                        />
                                    </div>

                                    {/* Texto */}
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '13px', fontWeight: '600',
                                            color: '#1C1917', marginBottom: '2px',
                                            whiteSpace: 'nowrap', overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {tx.description}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#A8A29E' }}>
                                            {formatDate(tx.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Puntos */}
                                <div style={{
                                    flexShrink: 0,
                                    marginLeft: '12px',
                                    background: isEarn ? 'rgba(43,191,170,0.1)' : 'rgba(255,140,66,0.1)',
                                    border: `1px solid ${isEarn ? 'rgba(43,191,170,0.2)' : 'rgba(255,140,66,0.2)'}`,
                                    borderRadius: '100px',
                                    padding: '4px 10px',
                                }}>
                                    <span style={{
                                        fontSize: '13px', fontWeight: '700',
                                        color: isEarn ? '#2BBFAA' : '#FF8C42',
                                    }}>
                                        {isEarn ? '+' : ''}{tx.points}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <style>{`
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(12px); }
                    to   { opacity:1; transform:translateY(0); }
                }
            `}</style>
        </div>
    )
}