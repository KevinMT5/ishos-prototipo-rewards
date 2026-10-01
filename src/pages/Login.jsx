import { useState } from 'react'
import { Check, Copy, ExternalLink, Gift, Moon, QrCode, Sparkles, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const BENEFITS = [
    { icon: Sparkles, title: 'Acumula', text: 'Puntos en cada compra' },
    { icon: QrCode, title: 'Escanea', text: 'Tu QR personal' },
    { icon: Gift, title: 'Disfruta', text: 'Premios exclusivos' },
]

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.37l-3.24-2.54c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.14H3.05v2.62A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.4 13.92A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.32-1.92V7.46H3.05A10 10 0 0 0 2 12c0 1.62.39 3.16 1.05 4.54l3.35-2.62Z" />
            <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.95 5.46l3.35 2.62c.79-2.38 3-4.14 5.6-4.14Z" />
        </svg>
    )
}

export default function Login() {
    const { loginWithGoogle } = useAuth()
    const { theme, setTheme } = useTheme()
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
        if (result?.success === false) setLoginNotice('failed')
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
        <main className="login-page">
            <div className="login-glow login-glow-one" />
            <div className="login-glow login-glow-two" />

            <div className="login-topbar">
                <img src="/logo.png" alt="Isho's Factory" />
                <button className="login-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <section className="login-hero">
                <span className="login-kicker">ISHO’S REWARDS</span>
                <h1>Tus visitas ahora <em>valen más.</em></h1>
                <p>Acumula puntos, sube de nivel y disfruta beneficios creados para ti.</p>
            </section>

            <section className="login-benefits" aria-label="Beneficios">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <article key={title}>
                        <span><Icon size={19} /></span>
                        <strong>{title}</strong>
                        <small>{text}</small>
                    </article>
                ))}
            </section>

            <section className="login-actions">
                <button className="google-button" onClick={handleGoogleLogin} disabled={signingIn}>
                    <GoogleIcon />
                    {signingIn ? 'Conectando...' : 'Continuar con Google'}
                </button>

                {loginNotice === 'in-app' && (
                    <div className="login-notice">
                        <strong><ExternalLink size={15} /> Abre la app en tu navegador</strong>
                        <p>En iPhone elige <b>Abrir en Safari</b>. En Android usa el menú ⋮ y selecciona <b>Abrir en Chrome</b>.</p>
                        <button type="button" onClick={copyAppLink}>{copyDone ? <Check size={14} /> : <Copy size={14} />}{copyDone ? 'Enlace copiado' : 'Copiar enlace'}</button>
                    </div>
                )}
                {loginNotice === 'failed' && <p className="login-error">No se pudo abrir Google. Intenta nuevamente desde Safari o Chrome.</p>}
                {loginNotice === 'copy-failed' && <p className="login-error">Mantén presionada la barra de dirección para copiar el enlace.</p>}

                <p className="login-legal">Al continuar aceptas recibir comunicaciones de Isho’s Factory.</p>
            </section>

            <style>{`
                .login-page { width:100%; min-height:100dvh; max-width:460px; margin:0 auto; padding:22px 24px calc(28px + env(safe-area-inset-bottom,0px)); display:flex; flex-direction:column; position:relative; overflow:hidden; background:var(--color-bg); color:var(--color-text); }
                .login-glow { position:absolute; border-radius:50%; pointer-events:none; filter:blur(2px); }
                .login-glow-one { width:280px; height:280px; right:-160px; top:-120px; background:rgba(102,207,192,.13); }
                .login-glow-two { width:240px; height:240px; left:-170px; bottom:-100px; background:rgba(229,30,140,.07); }
                .login-topbar { min-height:54px; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:1; }
                .login-topbar img { width:82px; height:42px; object-fit:contain; object-position:left center; }
                .login-theme { width:42px; height:42px; display:grid; place-items:center; border:1px solid var(--color-border); border-radius:14px; background:var(--color-elevated); color:var(--color-text-secondary); cursor:pointer; }
                .login-hero { margin-top:clamp(44px,9vh,84px); position:relative; z-index:1; }
                .login-kicker { color:var(--color-primary-ink); font-size:11px; font-weight:800; letter-spacing:.16em; }
                .login-hero h1 { max-width:360px; margin:14px 0 15px; color:var(--color-text); font-family:'Outfit',sans-serif; font-size:clamp(38px,10vw,48px); line-height:1.02; letter-spacing:-.045em; }
                .login-hero h1 em { display:block; color:#E56A32; font-style:normal; }
                .login-hero p { max-width:330px; color:var(--color-text-secondary); font-size:15px; line-height:1.55; }
                .login-benefits { margin-top:38px; display:grid; grid-template-columns:repeat(3,1fr); gap:9px; position:relative; z-index:1; }
                .login-benefits article { min-width:0; padding:13px 10px; display:flex; flex-direction:column; border:1px solid var(--color-border); border-radius:18px; background:var(--color-elevated); box-shadow:0 6px 18px rgba(0,0,0,.04); }
                .login-benefits article>span { width:35px; height:35px; margin-bottom:14px; display:grid; place-items:center; border-radius:11px; background:var(--color-primary-soft); color:var(--color-primary-ink); }
                .login-benefits strong { color:var(--color-text); font-size:12px; }
                .login-benefits small { margin-top:3px; color:var(--color-text-secondary); font-size:9px; line-height:1.3; }
                .login-actions { margin-top:auto; padding-top:34px; position:relative; z-index:1; }
                .google-button { width:100%; min-height:54px; display:flex; align-items:center; justify-content:center; gap:11px; border:1px solid #DCD8D5; border-radius:17px; background:#FFF; color:#272422; font-size:15px; font-weight:700; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,.09); transition:transform .18s ease,box-shadow .18s ease; }
                .google-button:active { transform:scale(.98); }
                .google-button:disabled { opacity:.65; cursor:wait; }
                .login-notice { margin-top:13px; padding:14px; border:1px solid #63452F; border-radius:15px; background:rgba(201,86,22,.1); color:var(--color-text-secondary); font-size:11px; line-height:1.45; }
                .login-notice strong { display:flex; align-items:center; gap:7px; color:var(--color-text); font-size:12px; }
                .login-notice p { margin-top:5px; }
                .login-notice button { margin-top:10px; padding:8px 10px; display:flex; align-items:center; gap:6px; border:0; border-radius:10px; background:rgba(229,106,50,.15); color:#E78355; font-size:11px; font-weight:700; cursor:pointer; }
                .login-error { margin-top:12px; color:#E78355; text-align:center; font-size:11px; line-height:1.4; }
                .login-legal { margin:15px auto 0; max-width:300px; color:var(--color-text-muted); text-align:center; font-size:10px; line-height:1.45; }
                [data-theme='light'] .login-page { background:linear-gradient(180deg,#FBF9FC 0%,#F7FBFA 100%); }
                [data-theme='dark'] .login-page { background:#101614; }
                @media (max-height:720px) { .login-hero{margin-top:25px}.login-benefits{margin-top:25px}.login-actions{padding-top:24px} }
            `}</style>
        </main>
    )
}
