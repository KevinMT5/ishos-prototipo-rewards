import { NavLink } from 'react-router-dom'
// 1. Importamos los íconos de lucide-react
import { Home, Gift, ClipboardList, User } from 'lucide-react'

// 2. Pasamos el componente del ícono (sin las flechas < >)
const TABS = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/rewards', icon: Gift, label: 'Premios' },
    { to: '/history', icon: ClipboardList, label: 'Historial' },
    { to: '/profile', icon: User, label: 'Perfil' },
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
            {TABS.map((tab) => {
                // Guardamos el componente del ícono en una variable con mayúscula para que React lo entienda
                const IconComponent = tab.icon;

                return (
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '24px', // Mantenemos un alto fijo para evitar saltos
                                    transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                                    transition: 'transform 0.2s',
                                }}>
                                    {/* 3. Dibujamos el ícono aquí, cambiando su estilo si está activo */}
                                    <IconComponent 
                                        size={22} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                    />
                                </span>
                                <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.03em' }}>
                                    {tab.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    )
}