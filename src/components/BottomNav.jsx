import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClipboardList, Gift, Home, QrCode, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import QRCode from './QRCode'

const FIRST_TABS = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/rewards', icon: Gift, label: 'Premios' },
]

const LAST_TABS = [
    { to: '/history', icon: ClipboardList, label: 'Historial' },
    { to: '/profile', icon: User, label: 'Perfil' },
]

function LoyaltyQrIcon({ size = 30 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="3.2" />
            <rect x="19.5" y="2.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="3.2" />
            <rect x="2.5" y="19.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="3.2" />
            <rect x="20" y="19" width="4.5" height="4.5" rx="1.1" fill="currentColor" />
            <rect x="26.5" y="19" width="3.5" height="3.5" rx="1" fill="currentColor" />
            <rect x="20" y="25.5" width="3.5" height="4.5" rx="1" fill="currentColor" />
            <rect x="26" y="25" width="4" height="4" rx="1" fill="currentColor" />
            <rect x="14.5" y="14.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
        </svg>
    )
}

function Tab({ tab }) {
    const Icon = tab.icon
    return (
        <NavLink to={tab.to} end={tab.to === '/'} className="lg-link">
            {({ isActive }) => (
                <div className={`lg-tab ${isActive ? 'lg-tab-active' : ''}`}>
                    <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? '#2F786E' : '#78716C'} />
                    <span className="lg-label">{tab.label}</span>
                </div>
            )}
        </NavLink>
    )
}

export default function BottomNav() {
    const { user } = useAuth()
    const [showQR, setShowQR] = useState(false)
    const qrValue = `ISHOS:${user?.uid || 'GUEST'}`
    const qrLabel = `ISHOS-${user?.uid?.slice(0, 8).toUpperCase() || 'GUEST'}`

    useEffect(() => {
        if (!showQR) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = previous }
    }, [showQR])

    return (
        <>
            <nav className="lg-nav" aria-label="Navegación principal">
                {FIRST_TABS.map(tab => <Tab key={tab.to} tab={tab} />)}

                <button className="qr-fab" onClick={() => setShowQR(true)} aria-label="Mostrar mi código QR">
                    <span className="qr-fab-ring"><span className="qr-fab-core"><LoyaltyQrIcon size={32} /></span></span>
                </button>

                {LAST_TABS.map(tab => <Tab key={tab.to} tab={tab} />)}
            </nav>

            {showQR && (
                <div className="qr-backdrop" onClick={() => setShowQR(false)}>
                    <section className="qr-sheet" role="dialog" aria-modal="true" aria-labelledby="qr-sheet-title" onClick={event => event.stopPropagation()}>
                        <div className="qr-handle" />
                        <button className="qr-sheet-close" onClick={() => setShowQR(false)} aria-label="Cerrar código QR"><X size={18} /></button>

                        <div className="qr-sheet-heading">
                            <span>Tarjeta de cliente</span>
                            <h2 id="qr-sheet-title">Escanea para acumular</h2>
                            <p>Presenta este código al personal de caja</p>
                        </div>

                        <div className="qr-sheet-code"><QRCode value={qrValue} size={224} /></div>
                        <strong className="qr-sheet-label">{qrLabel}</strong>

                        <div className="qr-sheet-tip">
                            <QrCode size={17} />
                            <span>Mantén la pantalla visible y con buen brillo durante el escaneo.</span>
                        </div>
                    </section>
                </div>
            )}

            <style>{`
                .lg-nav {
                    position:fixed; bottom:calc(10px + env(safe-area-inset-bottom,0px)); left:50%; transform:translateX(-50%); z-index:1000;
                    width:min(calc(100% - 24px),436px); display:grid; grid-template-columns:repeat(5,1fr); gap:2px; padding:7px;
                    background:rgba(255,255,255,.94); backdrop-filter:blur(24px) saturate(150%); -webkit-backdrop-filter:blur(24px) saturate(150%);
                    border:1px solid rgba(232,222,211,.9); border-radius:25px; box-shadow:0 14px 38px rgba(28,25,23,.16);
                }
                .lg-link { min-width:0; text-decoration:none; }
                .lg-tab { min-height:54px; padding:7px 2px 6px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-radius:17px; transition:background .2s ease,transform .2s ease; }
                .lg-tab-active { background:var(--color-primary-soft); }
                .lg-label { color:var(--color-text-muted); font-size:9px; font-weight:700; line-height:1; white-space:nowrap; }
                .lg-tab-active .lg-label { color:var(--color-primary-ink); }
                .lg-tab:active { transform:scale(.95); }
                .qr-fab { position:relative; top:-25px; min-width:0; height:54px; display:flex; align-items:flex-start; justify-content:center; border:0; background:transparent; color:white; cursor:pointer; }
                .qr-fab-ring { width:78px; height:78px; padding:8px; display:grid; place-items:center; border-radius:50%; background:#D9F3EF; box-shadow:0 10px 28px rgba(67,173,157,.28),0 2px 8px rgba(43,38,40,.08); transition:transform .18s ease,box-shadow .18s ease; }
                .qr-fab-core { width:100%; height:100%; display:grid; place-items:center; border-radius:50%; background:linear-gradient(145deg,#64D0C0,#4DBBAB); box-shadow:inset 0 1px 0 rgba(255,255,255,.3); }
                .qr-fab:active .qr-fab-ring { transform:scale(.94); }
                .qr-backdrop { position:fixed; inset:0; z-index:1200; display:flex; align-items:flex-end; justify-content:center; background:rgba(45,40,43,.3); backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); animation:qrFade .22s ease; }
                .qr-sheet { position:relative; width:100%; max-width:460px; padding:12px 24px calc(26px + env(safe-area-inset-bottom,0px)); border:1px solid #DDECE9; border-bottom:0; border-radius:30px 30px 0 0; background:linear-gradient(165deg,#fff 20%,#EFFAF8 100%); box-shadow:0 -18px 50px rgba(43,35,40,.18); text-align:center; animation:qrSlide .34s cubic-bezier(.22,.9,.35,1); }
                .qr-handle { width:42px; height:5px; margin:0 auto 15px; border-radius:99px; background:#D9D2D8; }
                .qr-sheet-close { position:absolute; top:18px; right:18px; width:36px; height:36px; display:grid; place-items:center; border:1px solid #E4DFE3; border-radius:50%; background:white; color:var(--color-text-secondary); cursor:pointer; }
                .qr-sheet-heading > span { color:var(--color-primary-ink); font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
                .qr-sheet-heading h2 { margin:5px 0 3px; font-family:'Cormorant Garamond',serif; font-size:29px; line-height:1; }
                .qr-sheet-heading p { color:var(--color-text-secondary); font-size:12px; }
                .qr-sheet-code { width:max-content; max-width:100%; margin:19px auto 10px; padding:16px; border:1px solid #E4DFE3; border-radius:23px; background:white; box-shadow:0 10px 28px rgba(65,45,31,.09); }
                .qr-sheet-code svg,.qr-sheet-code canvas { max-width:100%; height:auto!important; }
                .qr-sheet-label { display:block; color:var(--color-text-secondary); font-size:11px; letter-spacing:.11em; }
                .qr-sheet-tip { margin-top:17px; padding:12px 14px; display:flex; align-items:center; gap:10px; border-radius:15px; background:#DFF5F1; color:#315F59; text-align:left; font-size:11px; line-height:1.4; }
                .qr-sheet-tip svg { flex:none; }
                @keyframes qrFade { from { opacity:0 } to { opacity:1 } }
                @keyframes qrSlide { from { transform:translateY(100%) } to { transform:translateY(0) } }
            `}</style>
        </>
    )
}
