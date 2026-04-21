import { NavLink } from 'react-router-dom'
import { Home, Gift, ClipboardList, User } from 'lucide-react'

const TABS = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/rewards', icon: Gift, label: 'Premios' },
    { to: '/history', icon: ClipboardList, label: 'Historial' },
    { to: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
    return (
        <>
            <style>{`
                @keyframes lgFadeIn {
                    from { opacity: 0; transform: translateY(5px) scale(0.85); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }

                .lg-nav {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 8px;
                    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));

                    /* Liquid Glass base */
                    background: rgba(255, 255, 255, 0.22);
                    backdrop-filter: blur(40px) saturate(200%) brightness(1.05);
                    -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.05);
                    border-radius: 36px;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow:
                        0 12px 40px rgba(0, 0, 0, 0.10),
                        0 2px 6px   rgba(0, 0, 0, 0.06),
                        inset 0 1.5px 0 rgba(255, 255, 255, 0.75),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.15);
                    position: fixed; /* redeclare for ::before context */
                }

                /* Highlight de vidrio superior */
                .lg-nav::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 36px;
                    background: linear-gradient(
                        160deg,
                        rgba(255,255,255,0.45) 0%,
                        rgba(255,255,255,0.05) 50%,
                        rgba(255,255,255,0.0) 100%
                    );
                    pointer-events: none;
                }

                .lg-tab {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    padding: 10px 16px;
                    border-radius: 28px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: transparent;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                    min-width: 52px;
                }

                .lg-tab-active {
                    background: rgba(43, 191, 170, 0.18);
                    border: 1px solid rgba(43, 191, 170, 0.40);
                    box-shadow:
                        0 4px 20px rgba(43, 191, 170, 0.20),
                        inset 0 1.5px 0 rgba(255, 255, 255, 0.65),
                        inset 0 -1px 0 rgba(43, 191, 170, 0.15);
                    padding: 10px 22px;
                }

                /* Brillo interno pill activo */
                .lg-tab-active::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 8%;
                    width: 84%;
                    height: 50%;
                    background: linear-gradient(
                        180deg,
                        rgba(255, 255, 255, 0.55) 0%,
                        rgba(255, 255, 255, 0.00) 100%
                    );
                    border-radius: 28px 28px 0 0;
                    pointer-events: none;
                }

                .lg-icon {
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .lg-icon-active {
                    filter: drop-shadow(0 2px 8px rgba(43, 191, 170, 0.55));
                    transform: scale(1.08) translateY(-1px);
                }

                .lg-label {
                    font-family: 'Outfit', system-ui, sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    color: #2BBFAA;
                    line-height: 1;
                    white-space: nowrap;
                    text-shadow: 0 1px 3px rgba(255,255,255,0.9);
                    animation: lgFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>

            <nav className="lg-nav">
                {TABS.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            end={tab.to === '/'}
                            style={{ textDecoration: 'none' }}
                        >
                            {({ isActive }) => (
                                <div className={`lg-tab ${isActive ? 'lg-tab-active' : ''}`}>
                                    <Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                        color={isActive ? '#2BBFAA' : 'rgba(120,113,108,0.65)'}
                                        className={`lg-icon ${isActive ? 'lg-icon-active' : ''}`}
                                    />
                                    {isActive && (
                                        <span className="lg-label">{tab.label}</span>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    )
                })}
            </nav>
        </>
    )
}