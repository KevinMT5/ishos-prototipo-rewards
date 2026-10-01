import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { IceCreamBowl, Gift, TrendingUp, TrendingDown, ReceiptText, AlertCircle } from 'lucide-react'

function formatDate(ts) {
    try {
        const d = ts?.toDate ? ts.toDate() : new Date(ts)
        return d.toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return '—' }
}

function timestampMillis(value) {
    if (value?.toMillis) return value.toMillis()
    if (value?.toDate) return value.toDate().getTime()
    const millis = new Date(value || 0).getTime()
    return Number.isNaN(millis) ? 0 : millis
}

export default function History() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!user) return
        async function load() {
            setLoading(true)
            setError(false)
            try {
                const q = query(
                    collection(db, 'transactions'),
                    where('userId', '==', user.uid)
                )
                const snap = await getDocs(q)
                const rows = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt))
                    .slice(0, 30)
                setTransactions(rows)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user])

    const data = transactions

    const totalGanado  = data.filter(t => t.type === 'earn').reduce((a, t) => a + t.points, 0)
    const totalCanjeado = Math.abs(data.filter(t => t.type === 'redeem').reduce((a, t) => a + t.points, 0))

    return (
        <div className="page">

            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Historial</h1>
                <p className="page-subtitle">
                    Tus visitas y canjes recientes
                </p>
            </div>

            {/* ── Stats resumen ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Puntos ganados', val: `+${totalGanado}`, icon: TrendingUp, tint: '#F0FAF7', border: '#CDEBE4', accent: '#2F786E' },
                    { label: 'Puntos canjeados', val: `-${totalCanjeado}`, icon: TrendingDown, tint: '#FFF4EA', border: '#F6DCC8', accent: '#C95616' },
                ].map((s, i) => {
                    const Icon = s.icon
                    return (
                        <div key={i} className="history-stat" style={{
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
                    color: '#57534E', fontSize: '14px',
                }}>
                    Cargando...
                </div>
            ) : error ? (
                <div className="surface-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
                    <AlertCircle size={32} color="#C95616" style={{ marginBottom: 10 }} />
                    <p style={{ fontWeight: 700, marginBottom: 5 }}>No pudimos cargar tu historial</p>
                    <p style={{ color: '#57534E', fontSize: 13, lineHeight: 1.5 }}>Revisa tu conexión e inténtalo nuevamente.</p>
                </div>
            ) : data.length === 0 ? (
                <div className="surface-card" style={{ textAlign: 'center', padding: '38px 24px' }}>
                    <div style={{ width: 58, height: 58, borderRadius: 18, background: '#E8F9F6', color: '#2F786E', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                        <ReceiptText size={27} />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Tu historial está listo para comenzar</p>
                    <p style={{ color: '#57534E', fontSize: 13, lineHeight: 1.5 }}>Cuando acumules o canjees puntos, verás los movimientos aquí.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.map((tx, i) => {
                        const isEarn = tx.type === 'earn'
                        const Icon   = isEarn ? IceCreamBowl : Gift
                        return (
                            <div
                                key={tx.id}
                                className="history-transaction"
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
                                            color={isEarn ? '#2F786E' : '#C95616'}
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
                                        <p style={{ fontSize: '11px', color: '#57534E' }}>
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
                                        color: isEarn ? '#2F786E' : '#C95616',
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
