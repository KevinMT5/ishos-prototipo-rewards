import { useAuth } from '../context/AuthContext'
import { usePoints } from '../hooks/usePoints'
import { Award, Flame, Heart, LogOut, Star } from 'lucide-react'

const BADGES = [
    { icon: Star, color: '#B7791F', bg: '#FFF6D8', name: 'Pionera', desc: 'Miembro de Isho’s' },
    { icon: Flame, color: '#C95616', bg: '#FFF0E4', name: 'Fan #1', desc: 'Visitas consecutivas' },
    { icon: Heart, color: '#C21875', bg: '#FCE9F4', name: 'Mango lover', desc: 'Tu sabor favorito' },
    { icon: Award, color: '#2F786E', bg: '#E8F9F6', name: 'VIP', desc: 'Nivel alcanzado' },
]

export default function Profile() {
    const { profile, logout } = useAuth()
    const { points, level } = usePoints()
    const initials = (profile?.name || 'CL').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="page profile-page">
            <header className="page-header">
                <h1 className="page-title">Mi perfil</h1>
                <p className="page-subtitle">Tu actividad y logros en Isho’s Rewards</p>
            </header>

            <section className="profile-card">
                <div className="profile-decoration" />
                <div className="profile-avatar">
                    {profile?.photoURL
                        ? <img src={profile.photoURL} alt="Foto de perfil" />
                        : initials}
                </div>
                <div className="profile-identity">
                    <h2>{profile?.name || 'Cliente'}</h2>
                    <p>{profile?.email || ''}</p>
                    <span>{level}</span>
                </div>
            </section>

            <section className="profile-stats" aria-label="Resumen de tu cuenta">
                <article><strong>{profile?.visits || 0}</strong><span>Visitas</span></article>
                <article><strong>{points}</strong><span>Puntos</span></article>
                <article><strong>{level}</strong><span>Nivel</span></article>
            </section>

            <section>
                <p className="section-label">Tus insignias</p>
                <div className="badges-grid">
                    {BADGES.map(({ icon: Icon, ...badge }) => (
                        <article className="badge-card" key={badge.name}>
                            <span style={{ color: badge.color, background: badge.bg }}><Icon size={21} /></span>
                            <div><strong>{badge.name}</strong><small>{badge.desc}</small></div>
                        </article>
                    ))}
                </div>
            </section>

            <button className="logout-button" onClick={logout}>
                <LogOut size={17} /> Cerrar sesión
            </button>

            <style>{`
                .profile-page { display:flex; flex-direction:column; gap:19px; }
                .profile-page .page-header { margin-bottom:0; }
                .profile-card { position:relative; overflow:hidden; display:flex; align-items:center; gap:16px; padding:22px; background:linear-gradient(145deg,#fff,#F0FAF7); border:1px solid #CFE9E4; border-radius:27px; box-shadow:0 14px 38px rgba(45,107,96,.1); }
                .profile-decoration { position:absolute; right:-38px; top:-55px; width:140px; height:140px; border-radius:50%; background:rgba(82,198,181,.14); }
                .profile-avatar { position:relative; flex:none; width:76px; height:76px; display:grid; place-items:center; overflow:hidden; border-radius:24px; background:linear-gradient(145deg,#8BE1D5,#55C4B4); color:#173F39; font-size:25px; font-weight:700; box-shadow:0 8px 22px rgba(82,191,175,.18); }
                .profile-avatar img { width:100%; height:100%; object-fit:cover; }
                .profile-identity { position:relative; min-width:0; }
                .profile-identity h2 { font-family:'Cormorant Garamond',serif; font-size:25px; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .profile-identity p { margin:5px 0 9px; color:var(--color-text-secondary); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .profile-identity span { display:inline-block; padding:4px 10px; border-radius:999px; background:var(--color-primary-soft); color:var(--color-primary); font-size:11px; font-weight:700; }
                .profile-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
                .profile-stats article { padding:15px 6px; display:flex; flex-direction:column; align-items:center; background:white; border:1px solid var(--color-border); border-radius:18px; box-shadow:0 5px 18px rgba(75,57,41,.05); min-width:0; }
                .profile-stats strong { max-width:100%; overflow:hidden; text-overflow:ellipsis; font-family:'Cormorant Garamond',serif; font-size:21px; color:var(--color-primary); }
                .profile-stats span { margin-top:3px; color:var(--color-text-secondary); font-size:10px; }
                .badges-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .badge-card { display:flex; align-items:center; gap:10px; min-height:78px; padding:12px; background:white; border:1px solid var(--color-border); border-radius:19px; box-shadow:0 5px 18px rgba(75,57,41,.045); }
                .badge-card > span { width:39px; height:39px; flex:none; display:grid; place-items:center; border-radius:12px; }
                .badge-card div { min-width:0; display:flex; flex-direction:column; }
                .badge-card strong { font-size:12px; }
                .badge-card small { margin-top:3px; color:var(--color-text-secondary); font-size:9px; line-height:1.25; }
                .logout-button { width:100%; min-height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border:1px solid #E6DDE4; border-radius:16px; background:white; color:var(--color-text-secondary); font-size:13px; font-weight:600; cursor:pointer; }
            `}</style>
        </div>
    )
}
