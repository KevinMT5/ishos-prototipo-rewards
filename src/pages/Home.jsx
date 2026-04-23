import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'
import ProgressRing from '../components/ProgressRing'
import QRCode from '../components/QRCode'
import { Gift, QrCode, Sparkles } from 'lucide-react'

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
        <div style={{
            paddingBottom: '100px',
            background: '#FFFBF5',
            minHeight: '100dvh',
        }}>

            {/* ── Tarjeta hero con liquid glass ── */}
            <div style={{
                margin: '12px 16px',
                background: 'linear-gradient(145deg, #1C1917 0%, #2a2520 100%)',
                borderRadius: '28px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
            }}>
                {/* Orbes decorativos */}
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '160px', height: '160px',
                    background: 'radial-gradient(circle, rgba(43,191,170,0.2), transparent)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-30px', left: '-20px',
                    width: '120px', height: '120px',
                    background: 'radial-gradient(circle, rgba(255,140,66,0.15), transparent)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />

                {/* Highlight superior liquid glass */}
                <div style={{
                    position: 'absolute', top: 0, left: '8%', width: '84%', height: '45%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
                    borderRadius: '28px 28px 0 0',
                    pointerEvents: 'none',
                }} />

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '20px', position: 'relative',
                }}>
                    <div>
                        <p style={{
                            fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px',
                        }}>
                            Hola, {firstName} 👋
                        </p>
                        <span style={{
                            background: lvlColor, color: 'white',
                            padding: '3px 10px', borderRadius: '100px',
                            fontSize: '11px', fontWeight: '600',
                        }}>
                            {level}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowQR(v => !v)}
                        style={{
                            background: 'rgba(43,191,170,0.15)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(43,191,170,0.35)',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#2BBFAA',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        <QrCode size={14} /> {showQR ? 'Ocultar' : 'Mi QR'}
                    </button>
                </div>

                {/* QR o anillo */}
                {showQR ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            borderRadius: '20px',
                            padding: '16px',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                            marginBottom: '12px',
                        }}>
                            <QRCode value={qrValue} size={160} />
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '0.08em' }}>
                            {qrValue}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '4px' }}>
                            Presenta en tienda para acumular puntos
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                            <ProgressRing pts={points} max={nextThresh} size={100} />
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '26px', fontWeight: '700',
                                    color: 'white', lineHeight: 1,
                                }}>
                                    {points}
                                </span>
                                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                                    PUNTOS
                                </span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>
                                Próximo nivel
                            </p>
                            <div style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '100px', height: '6px', marginBottom: '6px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}>
                                <div style={{
                                    background: 'linear-gradient(90deg, #2BBFAA, #7ffff4)',
                                    height: '100%', borderRadius: '100px',
                                    width: `${Math.min((points / nextThresh) * 100, 100)}%`,
                                    transition: 'width 0.8s ease',
                                    boxShadow: '0 0 6px rgba(43,191,170,0.5)',
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
                <p style={{
                    fontSize: '12px', fontWeight: '600', color: '#78716C',
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px',
                }}>
                    Acciones rápidas
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                        { icon: Gift,   label: 'Mis premios', sub: '6 disponibles', tint: 'rgba(43,191,170,0.08)',  border: 'rgba(43,191,170,0.18)',  accent: '#2BBFAA' },
                        { icon: QrCode, label: 'Código QR',   sub: 'Para acumular', tint: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.18)',  accent: '#FF8C42', action: () => setShowQR(true) },
                    ].map((a, i) => {
                        const Icon = a.icon
                        return (
                            <button
                                key={i}
                                onClick={a.action}
                                style={{
                                    background: a.tint,
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    border: `1px solid ${a.border}`,
                                    borderRadius: '20px',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    WebkitTapHighlightColor: 'transparent',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.04)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <div style={{
                                    position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                                    borderRadius: '20px 20px 0 0',
                                    pointerEvents: 'none',
                                }} />
                                <div style={{ color: a.accent }}>
                                    <Icon size={28} strokeWidth={2} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917' }}>
                                        {a.label}
                                    </span>
                                    <span style={{ fontSize: '11px', color: a.accent, fontWeight: '500' }}>
                                        {a.sub}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Premio destacado ── */}
            <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                <p style={{
                    fontSize: '12px', fontWeight: '600', color: '#78716C',
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px',
                }}>
                    Premio destacado
                </p>
                <div style={{
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                        borderRadius: '20px 20px 0 0',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'rgba(43,191,170,0.1)',
                        border: '1px solid rgba(43,191,170,0.2)',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: '#2BBFAA',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                    }}>
                        <Sparkles size={28} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1C1917', marginBottom: '2px' }}>
                            Sorbete Gratis
                        </p>
                        <p style={{ fontSize: '12px', color: '#78716C', marginBottom: '8px' }}>
                            Un vaso de cualquier sabor
                        </p>
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