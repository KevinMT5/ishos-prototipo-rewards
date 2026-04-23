import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'
import { Star, Flame, Heart, Award, LogOut } from 'lucide-react'

const LEVEL_COLOR = { Bronce: '#CD7F32', Plata: '#9E9E9E', Oro: '#FF8C42', Diamante: '#2BBFAA' }

const BADGES = [
    { icon: Star,  color: '#FCD34D', name: 'Pionera',      desc: 'Miembro desde 2024' },
    { icon: Flame, color: '#EF4444', name: 'Fan #1',       desc: '10 visitas seguidas' },
    { icon: Heart, color: '#F97316', name: 'Mango lover',  desc: 'Sabor más pedido' },
    { icon: Award, color: '#2BBFAA', name: 'VIP',          desc: 'Nivel alcanzado' },
]

export default function Profile() {
    const { profile, logout } = useAuth()
    const { points, level } = usePoints()

    const lvlColor = LEVEL_COLOR[level] || '#CD7F32'
    const initials = (profile?.name || 'CL')
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div style={{
            padding: '16px',
            paddingBottom: '100px',
            background: '#FFFBF5',
            minHeight: '100dvh',
        }}>

            {/* ── Hero de perfil ── */}
            <div style={{
                margin: '0 0 16px',
                background: 'linear-gradient(145deg, #1C1917 0%, #2a2520 100%)',
                borderRadius: '28px',
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                textAlign: 'center',
            }}>
                {/* Orbes */}
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
                {/* Highlight */}
                <div style={{
                    position: 'absolute', top: 0, left: '8%', width: '84%', height: '45%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                    borderRadius: '28px 28px 0 0', pointerEvents: 'none',
                }} />

                {/* Avatar */}
                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2BBFAA, #FF8C42)',
                    margin: '0 auto 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: profile?.photoURL ? '0' : '28px',
                    fontWeight: '600', color: 'white',
                    overflow: 'hidden',
                    boxShadow: '0 0 0 3px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.3)',
                    position: 'relative',
                }}>
                    {profile?.photoURL
                        ? <img src={profile.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials
                    }
                </div>

                <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '24px', fontWeight: '700',
                    color: 'white', marginBottom: '4px',
                    position: 'relative',
                }}>
                    {profile?.name || 'Cliente'}
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '14px', position: 'relative' }}>
                    {profile?.email || ''}
                </p>

                {/* Badge de nivel */}
                <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${lvlColor}55`,
                    color: lvlColor,
                    padding: '5px 16px',
                    borderRadius: '100px',
                    fontSize: '12px', fontWeight: '700',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                    position: 'relative',
                }}>
                    {level} · {points} pts
                </span>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                    { label: 'Visitas', val: profile?.visits || 0 },
                    { label: 'Puntos',  val: points },
                    { label: 'Nivel',   val: level },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '14px 10px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.04)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                            borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                        }} />
                        <p style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '24px', fontWeight: '700',
                            color: '#1C1917', lineHeight: 1, marginBottom: '4px',
                        }}>
                            {s.val}
                        </p>
                        <p style={{ fontSize: '11px', color: '#78716C', fontWeight: '500' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Insignias ── */}
            <p style={{
                fontSize: '12px', fontWeight: '600', color: '#78716C',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '10px', paddingLeft: '2px',
            }}>
                Insignias
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {BADGES.map((b, i) => {
                    const Icon = b.icon
                    return (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.7)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '14px',
                            border: '1px solid rgba(255,255,255,0.8)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: '5%', width: '90%', height: '50%',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
                                borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                            }} />
                            <div style={{
                                width: '40px', height: '40px',
                                background: 'rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.8)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                            }}>
                                <Icon size={20} color={b.color} strokeWidth={2.5} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <p style={{ fontSize: '12px', fontWeight: '600', color: '#1C1917', marginBottom: '2px' }}>
                                    {b.name}
                                </p>
                                <p style={{ fontSize: '10px', color: '#A8A29E' }}>{b.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Cerrar sesión ── */}
            <button
                onClick={logout}
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: '#78716C',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'opacity 0.2s',
                }}
            >
                <LogOut size={16} strokeWidth={2} />
                Cerrar sesión
            </button>
        </div>
    )
}