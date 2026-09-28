import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'
import ProgressRing from '../components/ProgressRing'
import { ArrowRight, ClipboardList, Gift, Sparkles } from 'lucide-react'

const LEVEL_COLOR = { Bronce: '#B86B25', Plata: '#686875', Oro: '#C95616', Diamante: '#2F8F82' }
const NEXT_THRESHOLD = { Bronce: 100, Plata: 300, Oro: 600, Diamante: 600 }
const NEXT_NAME = { Bronce: 'Plata', Plata: 'Oro', Oro: 'Diamante', Diamante: 'Diamante' }

export default function Home() {
    const { profile } = useAuth()
    const { points, level } = usePoints()
    const navigate = useNavigate()

    const firstName = (profile?.name || 'Cliente').split(' ')[0]
    const nextThresh = NEXT_THRESHOLD[level] || 100
    const nextName = NEXT_NAME[level] || 'Plata'
    const remaining = Math.max(nextThresh - points, 0)

    return (
        <div className="page home-page">
            <header className="home-header">
                <div>
                    <p className="home-eyebrow">Hola, {firstName} 👋</p>
                    <h1 className="home-title">Tus recompensas</h1>
                </div>
                <span className="level-pill" style={{ color: LEVEL_COLOR[level] || LEVEL_COLOR.Bronce }}>
                    {level}
                </span>
            </header>

            <section className="balance-card" aria-label={`${points} puntos acumulados`}>
                <div className="balance-orb balance-orb-one" />
                <div className="balance-orb balance-orb-two" />
                <div className="balance-layout">
                    <div className="points-ring">
                        <ProgressRing pts={points} max={nextThresh} size={112} />
                        <div className="points-ring-value">
                            <strong>{points}</strong>
                            <span>puntos</span>
                        </div>
                    </div>
                    <div className="balance-copy">
                        <span className="balance-kicker">Próximo nivel</span>
                        <h2>{nextName}</h2>
                        <div className="progress-track">
                            <div style={{ width: `${Math.min((points / nextThresh) * 100, 100)}%` }} />
                        </div>
                        <p>{remaining > 0 ? `Te faltan ${remaining} puntos` : '¡Nivel completado!'}</p>
                    </div>
                </div>
            </section>

            <section>
                <p className="section-label">Acciones rápidas</p>
                <div className="quick-grid">
                    <button className="quick-card quick-card-teal" onClick={() => navigate('/rewards')}>
                        <span className="quick-icon"><Gift size={24} /></span>
                        <span><strong>Ver premios</strong><small>Explora el catálogo</small></span>
                        <ArrowRight size={17} />
                    </button>
                    <button className="quick-card quick-card-orange" onClick={() => navigate('/history')}>
                        <span className="quick-icon"><ClipboardList size={24} /></span>
                        <span><strong>Mi actividad</strong><small>Ver puntos y canjes</small></span>
                        <ArrowRight size={17} />
                    </button>
                </div>
            </section>

            <section>
                <div className="section-heading">
                    <p className="section-label">Premio destacado</p>
                    <button onClick={() => navigate('/rewards')}>Ver todos</button>
                </div>
                <button className="featured-reward" onClick={() => navigate('/rewards')}>
                    <span className="featured-icon"><Sparkles size={27} /></span>
                    <span className="featured-copy">
                        <strong>Sorbete gratis</strong>
                        <small>Un vaso de cualquier sabor</small>
                        <span className="reward-progress"><i style={{ width: `${Math.min((points / 150) * 100, 100)}%` }} /></span>
                        <em>{points >= 150 ? 'Disponible para canjear' : `${points} de 150 puntos`}</em>
                    </span>
                    <ArrowRight size={20} />
                </button>
            </section>

            <style>{`
                .home-page { display: flex; flex-direction: column; gap: 22px; }
                .home-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
                .home-eyebrow { color:var(--color-text-secondary); font-size:13px; margin-bottom:3px; }
                .home-title { font-family:'Cormorant Garamond',serif; font-size:34px; line-height:1; }
                .level-pill { background:white; border:1px solid var(--color-border); border-radius:999px; padding:7px 12px; font-size:12px; font-weight:700; box-shadow:0 5px 18px rgba(75,57,41,.06); }
                .balance-card { position:relative; overflow:hidden; min-height:252px; padding:22px; background:linear-gradient(145deg,#fff 15%,#F2FBF8 100%); border:1px solid #D1EAE5; border-radius:28px; box-shadow:0 14px 38px rgba(45,107,96,.11); }
                .balance-orb { position:absolute; border-radius:50%; pointer-events:none; }
                .balance-orb-one { width:170px; height:170px; right:-70px; top:-80px; background:rgba(82,198,181,.14); }
                .balance-orb-two { width:110px; height:110px; left:-48px; bottom:-60px; background:rgba(231,29,140,.07); }
                .balance-layout { display:flex; align-items:center; gap:20px; min-height:156px; position:relative; }
                .points-ring { position:relative; flex:none; }
                .points-ring-value { position:absolute; inset:0; display:grid; place-content:center; text-align:center; }
                .points-ring-value strong { color:var(--color-primary-ink); font-family:'Cormorant Garamond',serif; font-size:31px; line-height:.85; }
                .points-ring-value span { margin-top:5px; color:var(--color-text-secondary); font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
                .balance-copy { flex:1; min-width:0; }
                .balance-kicker { color:var(--color-text-secondary); font-size:11px; text-transform:uppercase; letter-spacing:.08em; font-weight:600; }
                .balance-copy h2 { margin:3px 0 14px; font-family:'Cormorant Garamond',serif; font-size:28px; }
                .balance-copy p { color:var(--color-text-secondary); font-size:12px; margin-top:8px; }
                .progress-track,.reward-progress { display:block; height:7px; border-radius:999px; overflow:hidden; background:#E7E1EA; }
                .progress-track div,.reward-progress i { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#83DED1,#52C6B5); }
                .quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
                .quick-card { min-height:144px; padding:15px; border-radius:22px; border:1px solid; display:grid; grid-template-columns:1fr auto; grid-template-rows:auto 1fr; text-align:left; cursor:pointer; }
                .quick-card-teal { color:var(--color-primary-ink); background:#EDF9F6; border-color:#CBEAE4; }
                .quick-card-orange { color:#C95616; background:#FFF2E7; border-color:#F4D9C4; }
                .quick-icon { width:42px; height:42px; display:grid; place-items:center; border-radius:13px; background:rgba(255,255,255,.72); }
                .quick-card > span:nth-child(2) { grid-column:1 / 3; align-self:end; display:flex; flex-direction:column; }
                .quick-card strong { color:var(--color-text); font-size:14px; }
                .quick-card small { margin-top:3px; color:currentColor; font-size:11px; font-weight:500; }
                .quick-card > svg { align-self:center; }
                .section-heading { display:flex; align-items:center; justify-content:space-between; }
                .section-heading button { border:0; background:transparent; color:var(--color-primary); font-size:12px; font-weight:700; cursor:pointer; margin-bottom:11px; }
                .featured-reward { width:100%; padding:16px; display:flex; align-items:center; gap:13px; border:1px solid var(--color-border); border-radius:22px; background:white; text-align:left; box-shadow:var(--shadow-card); cursor:pointer; }
                .featured-icon { width:52px; height:52px; flex:none; display:grid; place-items:center; border-radius:16px; background:#FCE9F4; color:#C21875; }
                .featured-copy { flex:1; min-width:0; display:flex; flex-direction:column; }
                .featured-copy strong { font-size:14px; }
                .featured-copy small { color:var(--color-text-secondary); font-size:11px; margin:2px 0 9px; }
                .featured-copy em { margin-top:5px; color:var(--color-primary-ink); font-size:10px; font-style:normal; font-weight:700; }
                .featured-reward > svg { color:var(--color-text-muted); flex:none; }
            `}</style>
        </div>
    )
}
