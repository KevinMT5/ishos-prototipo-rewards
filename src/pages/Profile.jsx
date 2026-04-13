import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'

const LEVEL_COLOR = { Bronce: '#CD7F32', Plata: '#9E9E9E', Oro: '#FF8C42', Diamante: '#2BBFAA' }

const BADGES = [
    { icon: '🌟', name: 'Pionera', desc: 'Miembro desde 2024' },
    { icon: '🔥', name: 'Fan #1', desc: '10 visitas seguidas' },
    { icon: '🥭', name: 'Mango lover', desc: 'Sabor más pedido' },
    { icon: '🏆', name: 'VIP', desc: 'Nivel alcanzado' },
]

export default function Profile() {
    const { profile, logout } = useAuth()
    const { points, level } = usePoints()

    const lvlColor = LEVEL_COLOR[level] || '#CD7F32'
    const initials = (profile?.name || 'CL')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div style={{ padding: '16px' }}>

            {/* Avatar + nombre */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#2BBFAA,#FF8C42)',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: profile?.photoURL ? '0' : '26px',
                    fontWeight: '600',
                    color: 'white',
                    overflow: 'hidden',
                }}>
                    {profile?.photoURL
                        ? <img src={profile.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials
                    }
                </div>
                <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '22px', fontWeight: '700', color: '#1C1917', marginBottom: '2px' }}>
                    {profile?.name || 'Cliente'}
                </h2>
                <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '8px' }}>
                    {profile?.email || ''}
                </p>
                <span style={{ background: lvlColor, color: 'white', padding: '4px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>
                    {level} · {points} pts
                </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                    { label: 'Visitas', val: profile?.visits || 0 },
                    { label: 'Puntos', val: points },
                    { label: 'Nivel', val: level },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: 'white',
                        borderRadius: '14px',
                        padding: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(0,0,0,0.04)',
                    }}>
                        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '22px', fontWeight: '700', color: '#1C1917', lineHeight: 1 }}>
                            {s.val}
                        </p>
                        <p style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Insignias */}
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Insignias
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {BADGES.map((b, i) => (
                    <div key={i} style={{
                        background: 'white',
                        borderRadius: '14px',
                        padding: '12px',
                        border: '1px solid rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <div style={{ width: '36px', height: '36px', background: '#E8F8F5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                            {b.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#1C1917', marginBottom: '1px' }}>{b.name}</p>
                            <p style={{ fontSize: '10px', color: '#A8A29E' }}>{b.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cerrar sesión */}
            <button
                onClick={logout}
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1.5px solid #F5EDE4',
                    background: 'transparent',
                    color: '#78716C',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '8px',
                }}
            >
                Cerrar sesión
            </button>
        </div>
    )
}