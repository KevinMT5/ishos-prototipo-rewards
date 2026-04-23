import { useState } from 'react'
import { usePoints } from '../hooks/usePoints'
import RewardCard from '../components/RewardCard'
import { X, IceCreamBowl, Citrus, CupSoda, Tag, Users, Sparkles } from 'lucide-react'

const REWARDS = [
    { id: 'r1', name: 'Sorbete Gratis',     pts: 150, icon: IceCreamBowl, desc: 'Un vaso pequeño de cualquier sabor', color: '#E8F8F5', accent: '#2BBFAA' },
    { id: 'r2', name: 'Topping Premium',    pts: 80,  icon: Citrus,        desc: 'Agrega el topping que quieras',      color: '#FFF4EC', accent: '#FF8C42' },
    { id: 'r3', name: 'Vaso Grande Gratis', pts: 200, icon: CupSoda,       desc: 'Upgrade a vaso grande',              color: '#fce4ec', accent: '#E91E8C' },
    { id: 'r4', name: '10% Descuento',      pts: 60,  icon: Tag,           desc: 'En tu próxima compra',               color: '#f3e5f5', accent: '#9B7BB8' },
    { id: 'r5', name: 'Combo 2x1',          pts: 300, icon: Users,         desc: 'Trae a un amigo, paga uno',          color: '#E8F8F5', accent: '#1A8F7D' },
    { id: 'r6', name: 'Sabor Exclusivo',    pts: 120, icon: Sparkles,      desc: 'Acceso a sabores de temporada',      color: '#FFF4EC', accent: '#E67332' },
]

export default function Rewards() {
    const { points, redeemReward } = usePoints()
    const [selected, setSelected] = useState(null)
    const [redeemed, setRedeemed] = useState([])
    const [toast,    setToast]    = useState(null)
    const [loading,  setLoading]  = useState(false)

    function showToast(msg, color = '#2BBFAA') {
        setToast({ msg, color })
        setTimeout(() => setToast(null), 2500)
    }

    async function handleRedeem() {
        if (!selected) return
        setLoading(true)
        const result = await redeemReward(selected)
        setLoading(false)
        if (result.success) {
            setRedeemed(prev => [...prev, selected.id])
            setSelected(null)
            showToast(`¡${selected.name} canjeado! 🎉`)
        } else {
            showToast(result.error, '#E67332')
        }
    }

    const SelectedIcon = selected?.icon || Sparkles
    const canRedeem    = selected && points >= selected.pts

    return (
        <div style={{
            padding: '16px',
            paddingBottom: '100px',
            background: '#FFFBF5',
            minHeight: '100dvh',
            position: 'relative',
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(-8px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes slideUp {
                    from { transform:translateY(100%); }
                    to   { transform:translateY(0); }
                }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px', fontWeight: '700',
                    color: '#1C1917', marginBottom: '4px',
                }}>
                    Premios
                </h1>
                <p style={{ fontSize: '13px', color: '#78716C' }}>
                    Tu saldo: <strong style={{ color: '#2BBFAA' }}>{points} puntos</strong>
                </p>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {REWARDS.map(r => (
                    <RewardCard
                        key={r.id}
                        reward={r}
                        userPoints={points}
                        redeemed={redeemed.includes(r.id)}
                        onSelect={setSelected}
                    />
                ))}
            </div>

            {/* Modal */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(28,25,23,0.5)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        zIndex: 400,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'rgba(255,255,255,0.96)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            borderRadius: '28px 28px 0 0',
                            padding: '24px',
                            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 16px))',
                            width: '100%',
                            maxHeight: '72vh',
                            overflowY: 'auto',
                            marginBottom: '84px',
                            border: '1px solid rgba(255,255,255,0.9)',
                            borderBottom: 'none',
                            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,1), 0 -8px 40px rgba(0,0,0,0.12)',
                            animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                            position: 'relative',
                        }}
                    >
                        {/* Highlight glass superior */}
                        <div style={{
                            position: 'absolute', top: 0, left: '5%', width: '90%', height: '40%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                            borderRadius: '28px 28px 0 0',
                            pointerEvents: 'none',
                        }} />

                        {/* Drag handle */}
                        <div style={{
                            width: '40px', height: '4px',
                            background: 'rgba(0,0,0,0.08)',
                            borderRadius: '2px',
                            margin: '0 auto 20px',
                        }} />

                        {/* Botón cerrar */}
                        <button
                            onClick={() => setSelected(null)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                width: '32px', height: '32px',
                                background: 'rgba(0,0,0,0.06)',
                                border: 'none', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#78716C',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        {/* Ícono del premio */}
                        <div style={{
                            width: '72px', height: '72px',
                            background: `${selected.accent}18`,
                            border: `1px solid ${selected.accent}30`,
                            borderRadius: '22px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px ${selected.accent}22`,
                        }}>
                            <SelectedIcon size={36} color={selected.accent} strokeWidth={1.8} />
                        </div>

                        <h3 style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '26px', fontWeight: '700',
                            textAlign: 'center', color: '#1C1917', marginBottom: '6px',
                        }}>
                            {selected.name}
                        </h3>
                        <p style={{
                            fontSize: '14px', color: '#78716C',
                            textAlign: 'center', marginBottom: '20px',
                        }}>
                            {selected.desc}
                        </p>

                        {/* Badge de puntos */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <span style={{
                                background: canRedeem ? `${selected.accent}15` : 'rgba(232,224,216,0.8)',
                                color: canRedeem ? selected.accent : '#A8A29E',
                                border: `1px solid ${canRedeem ? `${selected.accent}30` : 'transparent'}`,
                                padding: '6px 20px',
                                borderRadius: '100px',
                                fontSize: '14px', fontWeight: '700',
                            }}>
                                {selected.pts} puntos
                            </span>
                        </div>

                        {/* Info si no alcanza */}
                        {!canRedeem && (
                            <p style={{
                                textAlign: 'center', fontSize: '12px',
                                color: '#A8A29E', marginBottom: '12px',
                            }}>
                                Te faltan {selected.pts - points} puntos para este premio
                            </p>
                        )}

                        {/* Botón canjear */}
                        <button
                            onClick={handleRedeem}
                            disabled={loading || !canRedeem}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '20px',
                                border: 'none',
                                cursor: canRedeem ? 'pointer' : 'not-allowed',
                                background: canRedeem
                                    ? 'linear-gradient(135deg, #2BBFAA, #1A8F7D)'
                                    : 'rgba(232,224,216,0.8)',
                                color: canRedeem ? 'white' : '#A8A29E',
                                fontSize: '16px', fontWeight: '600',
                                transition: 'all 0.2s',
                                boxShadow: canRedeem
                                    ? '0 8px 24px rgba(43,191,170,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    : 'none',
                                position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {canRedeem && (
                                <div style={{
                                    position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                                    borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                                }} />
                            )}
                            {loading ? 'Procesando...' : canRedeem ? 'Canjear ahora' : 'Puntos insuficientes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: 'calc(20px + env(safe-area-inset-top, 0px))',
                    left: '16px', right: '16px',
                    background: toast.color,
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    fontSize: '14px', fontWeight: '500',
                    textAlign: 'center',
                    zIndex: 500,
                    animation: 'fadeIn 0.3s ease',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}>
                    {toast.msg}
                </div>
            )}
        </div>
    )
}