import { NavLink } from 'react-router-dom'

const TABS = [
    { to: '/', icon: '🏠', label: 'Inicio' },
    { to: '/rewards', icon: '🎁', label: 'Premios' },
    { to: '/history', icon: '📋', label: 'Historial' },
    { to: '/profile', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(255,251,245,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(43,191,170,0.12)',
            display: 'flex',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
        }}>
            {TABS.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === '/'}
                    style={({ isActive }) => ({
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '8px 4px',
                        textDecoration: 'none',
                        color: isActive ? '#2BBFAA' : '#A8A29E',
                        position: 'relative',
                        transition: 'color 0.2s',
                        WebkitTapHighlightColor: 'transparent',
                    })}
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <span style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '32px',
                                    height: '3px',
                                    background: '#2BBFAA',
                                    borderRadius: '0 0 3px 3px',
                                }} />
                            )}
                            <span style={{
                                fontSize: '22px',
                                lineHeight: 1,
                                transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                                transition: 'transform 0.2s',
                            }}>
                                {tab.icon}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.03em' }}>
                                {tab.label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    )
}