import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { loginWithGoogle } = useAuth()

    return (
        <div style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg,#FFFBF5 0%,#FFF3E4 100%)',
            padding: '32px 24px',
        }}>
            {/* Logo / hero */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍧</div>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond,serif',
                    fontSize: '42px',
                    fontWeight: '700',
                    color: '#1C1917',
                    lineHeight: 1.1,
                    marginBottom: '8px',
                }}>
                    Isho's <span style={{ color: '#FF8C42' }}>Rewards</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#78716C', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
                    Acumula puntos en cada visita y canjea premios exclusivos
                </p>
            </div>

            {/* Beneficios */}
            <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {[
                    { icon: '🎁', text: 'Gana puntos en cada compra' },
                    { icon: '🏆', text: 'Sube de nivel: Bronce → Diamante' },
                    { icon: '⬛', text: 'Tu QR personal para acumular' },
                    { icon: '✨', text: 'Canjea premios y sabores exclusivos' },
                ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{b.icon}</span>
                        <span style={{ fontSize: '14px', color: '#78716C' }}>{b.text}</span>
                    </div>
                ))}
            </div>

            {/* Botón login */}
            <button
                onClick={loginWithGoogle}
                style={{
                    width: '100%',
                    maxWidth: '320px',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg,#2BBFAA,#1A8F7D)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 32px rgba(43,191,170,0.35)',
                    WebkitTapHighlightColor: 'transparent',
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Entrar con Google
            </button>

            <p style={{ fontSize: '12px', color: '#A8A29E', marginTop: '16px', textAlign: 'center' }}>
                Al ingresar aceptas recibir comunicaciones de Isho's Factory
            </p>
        </div>
    )
}