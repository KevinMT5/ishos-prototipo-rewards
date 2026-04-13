import { useState } from 'react'
import { usePoints } from '../hooks/usePoints'
import RewardCard from '../components/RewardCard'

const REWARDS = [
    { id: 'r1', name: 'Sorbete Gratis', pts: 150, emoji: '🍧', desc: 'Un vaso pequeño de cualquier sabor', color: '#E8F8F5', accent: '#2BBFAA' },
    { id: 'r2', name: 'Topping Premium', pts: 80, emoji: '🍓', desc: 'Agrega el topping que quieras', color: '#FFF4EC', accent: '#FF8C42' },
    { id: 'r3', name: 'Vaso Grande Gratis', pts: 200, emoji: '🍨', desc: 'Upgrade a vaso grande', color: '#fce4ec', accent: '#E91E8C' },
    { id: 'r4', name: '10% Descuento', pts: 60, emoji: '🎁', desc: 'En tu próxima compra', color: '#f3e5f5', accent: '#9B7BB8' },
    { id: 'r5', name: 'Combo 2x1', pts: 300, emoji: '🥂', desc: 'Trae a un amigo, paga uno', color: '#E8F8F5', accent: '#1A8F7D' },
    { id: 'r6', name: 'Sabor Exclusivo', pts: 120, emoji: '✨', desc: 'Acceso a sabores de temporada', color: '#FFF4EC', accent: '#E67332' },
]

export default function Rewards() {
    const { points, redeemReward } = usePoints()
    const [selected, setSelected] = useState(null)
    const [redeemed, setRedeemed] = useState([])
    const [toast, setToast] = useState(null)
    const [loading, setLoading] = useState(false)

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

    return (
        <div style={{ padding: '16px', position: 'relative' }}>

            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '28px', fontWeight: '700', color: '#1C1917', marginBottom: '4px' }}>
                    Premios
                </h1>
                <p style={{ fontSize: '13px', color: '#78716C' }}>
                    Tu saldo: <strong style={{ color: '#2BBFAA' }}>{points} puntos</strong>
                </p>
            </div>

            {/* Grid de premios */}
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

            {/* Modal de confirmación */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(28,25,23,0.6)',
                        display: 'flex', alignItems: 'flex-end',
                        zIndex: 200,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px 24px 0 0',
                            padding: '24px',
                            width: '100%',
                            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
                        }}
                    >
                        {/* Drag handle */}
                        <div style={{ width: '40px', height: '4px', background: '#F5EDE4', borderRadius: '2px', margin: '0 auto 20px' }} />

                        <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>{selected.emoji}</div>
                        <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#1C1917', marginBottom: '6px' }}>
                            {selected.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#78716C', textAlign: 'center', marginBottom: '20px' }}>
                            {selected.desc}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <span style={{ background: selected.color, color: selected.accent, padding: '6px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: '600' }}>
                                {selected.pts} puntos
                            </span>
                        </div>
                        <button
                            onClick={handleRedeem}
                            disabled={loading || points < selected.pts}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                cursor: points >= selected.pts ? 'pointer' : 'not-allowed',
                                background: points >= selected.pts
                                    ? 'linear-gradient(135deg,#2BBFAA,#1A8F7D)'
                                    : '#F5EDE4',
                                color: points >= selected.pts ? 'white' : '#A8A29E',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                            }}
                        >
                            {loading ? 'Procesando...' : points >= selected.pts ? 'Canjear ahora' : 'Puntos insuficientes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '16px',
                    right: '16px',
                    background: toast.color,
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center',
                    zIndex: 300,
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {toast.msg}
                </div>
            )}

            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}