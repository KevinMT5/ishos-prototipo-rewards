import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Star, Award, QrCode, Gift, ExternalLink, Copy, Check } from 'lucide-react'

const BENEFITS = [
    { icon: Star,   text: 'Gana puntos en cada compra' },
    { icon: Award,  text: 'Sube de nivel: Bronce → Diamante' },
    { icon: QrCode, text: 'Tu QR personal para acumular' },
    { icon: Gift,   text: 'Canjea premios y sabores exclusivos' },
]

export default function Login() {
    const { loginWithGoogle } = useAuth()
    const [loginNotice, setLoginNotice] = useState(null)
    const [copyDone, setCopyDone] = useState(false)
    const [signingIn, setSigningIn] = useState(false)

    const isEmbeddedBrowser = typeof navigator !== 'undefined' &&
        /FBAN|FBAV|Instagram|WhatsApp|Line\/|MicroMessenger|Snapchat|Twitter/i.test(navigator.userAgent)

    async function handleGoogleLogin() {
        if (isEmbeddedBrowser) {
            setLoginNotice('in-app')
            return
        }

        setLoginNotice(null)
        setSigningIn(true)
        const result = await loginWithGoogle()
        setSigningIn(false)

        if (result?.success === false) {
            setLoginNotice('failed')
        }
    }

    async function copyAppLink() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 2000)
        } catch {
            setLoginNotice('copy-failed')
        }
    }

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>{`
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    50% { transform: translate(15px,-15px) scale(1.06); }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(20px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .login-section { animation: fadeUp 0.5s ease both; }
                .login-section:nth-child(2) { animation-delay: 0.1s; }
                .login-section:nth-child(3) { animation-delay: 0.2s; }
                .login-btn:active { transform: scale(0.97) !important; }
                .login-btn:disabled { opacity: 0.65; cursor: wait; }
            `}</style>

            {/* Orbes de fondo */}
            <div style={{
                position: 'absolute', top: '-60px', right: '-60px',
                width: '220px', height: '220px',
                background: 'radial-gradient(circle, rgba(43,191,170,0.12), transparent)',
                borderRadius: '50%',
                animation: 'floatOrb 10s ease-in-out infinite',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-60px', left: '-60px',
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(255,140,66,0.1), transparent)',
                borderRadius: '50%',
                animation: 'floatOrb 14s ease-in-out infinite reverse',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '40%', left: '-40px',
                width: '140px', height: '140px',
                background: 'radial-gradient(circle, rgba(43,191,170,0.07), transparent)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            {/* ── Logo / Hero ── */}
            <div className="login-section" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '100px', height: '100px',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: '28px',
                    margin: '0 auto 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,1), 0 8px 32px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                        borderRadius: '28px 28px 0 0', pointerEvents: 'none',
                    }} />
                    <img
                        src="/logo.png"
                        alt="Isho's Factory"
                        style={{ height: '70px', objectFit: 'contain', position: 'relative' }}
                    />
                </div>

                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '44px', fontWeight: '700',
                    color: '#1C1917', lineHeight: 1.05, marginBottom: '10px',
                }}>
                    Isho's <span style={{ color: '#FF8C42', fontStyle: 'italic' }}>Rewards</span>
                </h1>
                <p style={{
                    fontSize: '15px', color: '#78716C',
                    lineHeight: 1.6, maxWidth: '270px', margin: '0 auto',
                }}>
                    Acumula puntos en cada visita y canjea premios exclusivos
                </p>
            </div>

            {/* ── Beneficios en card glass ── */}
            <div className="login-section" style={{
                width: '100%', maxWidth: '340px',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.85)',
                borderRadius: '28px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,1), 0 4px 24px rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Highlight */}
                <div style={{
                    position: 'absolute', top: 0, left: '5%', width: '90%', height: '45%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                    borderRadius: '28px 28px 0 0', pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                    {BENEFITS.map((b, i) => {
                        const Icon = b.icon
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    background: 'rgba(43,191,170,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(43,191,170,0.2)',
                                    borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                                }}>
                                    <Icon size={18} color="#2F786E" strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: '14px', color: '#1C1917', fontWeight: '500', lineHeight: 1.4 }}>
                                    {b.text}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Botón Google ── */}
            <div className="login-section" style={{ width: '100%', maxWidth: '340px' }}>
                <button
                    onClick={handleGoogleLogin}
                    disabled={signingIn}
                    className="login-btn"
                    style={{
                        width: '100%',
                        padding: '16px 24px',
                        borderRadius: '20px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #78D8CA, #52BFAF)',
                        color: '#173F39',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 8px 32px rgba(82,191,175,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                        WebkitTapHighlightColor: 'transparent',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    {/* Highlight del botón */}
                    <div style={{
                        position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                        borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                    }} />
                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'relative' }}>
                        <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span style={{ position: 'relative' }}>{signingIn ? 'Abriendo Google...' : 'Entrar con Google'}</span>
                </button>

                {loginNotice === 'in-app' && (
                    <div style={{
                        marginTop: '14px', padding: '14px',
                        borderRadius: '16px',
                        background: 'rgba(255,140,66,0.09)',
                        border: '1px solid rgba(255,140,66,0.22)',
                        color: '#78716C', fontSize: '12px', lineHeight: 1.5,
                    }}>
                        <p style={{ color: '#1C1917', fontWeight: '700', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ExternalLink size={14} color="#FF8C42" /> Abre la app fuera de WhatsApp
                        </p>
                        <p>En iPhone toca el botón de compartir y elige <strong>Abrir en Safari</strong>. En Android usa el menú ⋮ y selecciona <strong>Abrir en Chrome</strong>.</p>
                        <button
                            type="button"
                            onClick={copyAppLink}
                            style={{
                                marginTop: '10px', padding: '8px 12px',
                                borderRadius: '10px', border: 'none',
                                background: 'rgba(255,140,66,0.13)', color: '#E67332',
                                fontSize: '12px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}
                        >
                            {copyDone ? <Check size={13} /> : <Copy size={13} />}
                            {copyDone ? 'Enlace copiado' : 'Copiar enlace'}
                        </button>
                    </div>
                )}

                {loginNotice === 'failed' && (
                    <p style={{ marginTop: '12px', color: '#E67332', fontSize: '12px', textAlign: 'center', lineHeight: 1.45 }}>
                        No se pudo abrir Google. Intenta nuevamente desde Safari o Chrome.
                    </p>
                )}

                {loginNotice === 'copy-failed' && (
                    <p style={{ marginTop: '12px', color: '#E67332', fontSize: '12px', textAlign: 'center' }}>
                        Mantén presionada la barra de dirección para copiar el enlace.
                    </p>
                )}

                <p style={{
                    fontSize: '12px', color: '#57534E',
                    marginTop: '16px', textAlign: 'center', lineHeight: 1.5,
                }}>
                    Al ingresar aceptas recibir comunicaciones de Isho's Factory
                </p>
            </div>
        </div>
    )
}
