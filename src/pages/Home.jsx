import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'
import ProgressRing from '../components/ProgressRing'
import QRCode from '../components/QRCode'

const LEVEL_COLOR = { Bronce: '#CD7F32', Plata: '#9E9E9E', Oro: '#FF8C42', Diamante: '#2BBFAA' }
const NEXT_THRESHOLD = { Bronce: 100, Plata: 300, Oro: 600, Diamante: 600 }
const NEXT_NAME = { Bronce: 'Plata', Plata: 'Oro', Oro: 'Diamante', Diamante: 'Diamante' }

export default function Home() {
    const { profile, user } = useAuth()
    const { points, level } = usePoints()
    const [showQR, setShowQR] = useState(false)

    const firstName = (profile?.name || 'Cliente').split(' ')[0]
    const lvlColor = LEVEL_COLOR[level] || '#CD7F32'
    const nextThresh = NEXT_THRESHOLD[level] || 100
    const nextName = NEXT_NAME[level] || 'Plata'
    const remaining = Math.max(nextThresh - points, 0)
    const qrValue = `ISHOS-${user?.uid?.slice(0, 8).toUpperCase() || 'GUEST'}`

    return (
        <div style={{ paddingBottom: '16px' }}>

            {/* ── Tarjeta hero ── */}
            <div style={{
                margin: '12px 16px',
                background: 'linear-gradient(145deg,#1C1917 0%,#2a2520 100%)',
                borderRadius: '24px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Fondos decorativos */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', background: 'radial-gradient(circle,rgba(43,191,170,0.2),transparent)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle,rgba(255,140,66,0.15),transparent)', borderRadius: '50%' }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Hola, {firstName} 👋
                        </p>
                        <span style={{ background: lvlColor, color: 'white', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>
                            {level}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowQR(v => !v)}
                        style={{
                            background: 'rgba(43,191,170,0.2)',
                            border: '1px solid rgba(43,191,170,0.4)',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#2BBFAA',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        ⬛ {showQR ? 'Ocultar' : 'Mi QR'}
                    </button>
                </div>

                {/* QR o anillo de progreso */}
                {showQR ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
                        <QRCode value={qrValue} size={160} />
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '10px', letterSpacing: '0.08em' }}>
                            {qrValue}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '4px' }}>
                            Presenta en tienda para acumular puntos
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <ProgressRing pts={points} max={nextThresh} size={100} />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '26px', fontWeight: '700', color: 'white', lineHeight: 1 }}>
                                    {points}
                                </span>
                                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>PUNTOS</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Próximo nivel</p>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '100px', height: '6px', marginBottom: '6px' }}>
                                <div style={{
                                    background: '#2BBFAA',
                                    height: '100%',
                                    borderRadius: '100px',
                                    width: `${Math.min((points / nextThresh) * 100, 100)}%`,
                                    transition: 'width 0.8s ease',
                                }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
                                {remaining} pts para {nextName}
                            </p>
                            <p style={{ color: '#2BBFAA', fontSize: '13px', fontWeight: '600', marginTop: '8px' }}>
                                {points} / {nextThresh} pts
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Acciones rápidas ── */}
            <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Acciones rápidas
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                        { icon: '🎁', label: 'Mis premios', sub: '6 disponibles', color: '#E8F8F5', accent: '#2BBFAA', href: '/rewards' },
                        { icon: '⬛', label: 'Código QR', sub: 'Para acumular', color: '#FFF4EC', accent: '#FF8C42', action: () => setShowQR(true) },
                    ].map((a, i) => (
                        <button
                            key={i}
                            onClick={a.action}
                            style={{
                                background: a.color,
                                border: 'none',
                                borderRadius: '16px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>{a.icon}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917' }}>{a.label}</span>
                            <span style={{ fontSize: '11px', color: a.accent, fontWeight: '500' }}>{a.sub}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Premio destacado ── */}
            <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Premio destacado
                </p>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}>
                    <div style={{ width: '56px', height: '56px', background: '#E8F8F5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                        🍧
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917', marginBottom: '2px' }}>Sorbete Gratis</p>
                        <p style={{ fontSize: '12px', color: '#78716C', marginBottom: '8px' }}>Un vaso de cualquier sabor</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '13px', color: '#2BBFAA', fontWeight: '600' }}>150 puntos</span>
                            <span style={{ fontSize: '11px', color: points >= 150 ? '#2BBFAA' : '#A8A29E', fontWeight: '500' }}>
                                {points >= 150 ? '✓ Disponible' : `Faltan ${150 - points} pts`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}