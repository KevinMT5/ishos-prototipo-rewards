import { useEffect, useRef, useState } from 'react'
import { Award, Camera, Flame, Heart, LogOut, Moon, Pencil, Save, Star, Sun, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { usePoints } from '../hooks/usePoints'

const BADGES = [
    { icon: Star, color: '#B7791F', bg: '#FFF6D8', name: 'Pionera', desc: 'Miembro de Isho’s' },
    { icon: Flame, color: '#C95616', bg: '#FFF0E4', name: 'Fan #1', desc: 'Visitas consecutivas' },
    { icon: Heart, color: '#C21875', bg: '#FCE9F4', name: 'Mango lover', desc: 'Tu sabor favorito' },
    { icon: Award, color: '#2F786E', bg: '#E8F9F6', name: 'VIP', desc: 'Nivel alcanzado' },
]

function imageToDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file?.type.startsWith('image/')) return reject(new Error('Selecciona una imagen válida.'))
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
        reader.onload = () => {
            const image = new Image()
            image.onerror = () => reject(new Error('No se pudo procesar la imagen.'))
            image.onload = () => {
                const maxSize = 420
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', 0.78))
            }
            image.src = reader.result
        }
        reader.readAsDataURL(file)
    })
}

export default function Profile() {
    const { user, profile, logout, saveProfile } = useAuth()
    const { theme, setTheme } = useTheme()
    const { points, level } = usePoints()
    const fileInput = useRef(null)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)
    const [form, setForm] = useState({ name: '', phone: '', birthDate: '', contactEmail: '', photoURL: '', favoriteFlavor: '' })

    const initials = (profile?.name || 'CL').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    useEffect(() => {
        if (!editing) return
        setForm({
            name: profile?.name || '',
            phone: profile?.phone || '',
            birthDate: profile?.birthDate || '',
            contactEmail: profile?.contactEmail || profile?.email || '',
            photoURL: profile?.photoURL || '',
            favoriteFlavor: profile?.favoriteFlavor || '',
        })
        setMessage(null)
    }, [editing, profile])

    useEffect(() => {
        if (!editing) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = previous }
    }, [editing])

    function updateField(event) {
        const { name, value } = event.target
        setForm(current => ({ ...current, [name]: value }))
    }

    async function choosePhoto(event) {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            setMessage(null)
            const photoURL = await imageToDataUrl(file)
            setForm(current => ({ ...current, photoURL }))
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            event.target.value = ''
        }
    }

    async function handleSave(event) {
        event.preventDefault()
        if (!form.name.trim()) {
            setMessage({ type: 'error', text: 'Escribe tu nombre.' })
            return
        }
        setSaving(true)
        setMessage(null)
        const result = await saveProfile({
            ...form,
            name: form.name.trim(),
            phone: form.phone.trim(),
            contactEmail: form.contactEmail.trim(),
            favoriteFlavor: form.favoriteFlavor.trim(),
        })
        setSaving(false)
        if (result.success) {
            setEditing(false)
        } else {
            setMessage({ type: 'error', text: 'No pudimos guardar los cambios. Inténtalo nuevamente.' })
        }
    }

    return (
        <div className="page profile-page">
            <header className="page-header profile-header">
                <div><h1 className="page-title">Mi perfil</h1><p className="page-subtitle">Tu actividad y preferencias</p></div>
                <button className="edit-profile-button" onClick={() => setEditing(true)}><Pencil size={15} /> Editar</button>
            </header>

            <section className="profile-card">
                <div className="profile-decoration" />
                <div className="profile-avatar">
                    {profile?.photoURL ? <img src={profile.photoURL} alt="Foto de perfil" /> : initials}
                </div>
                <div className="profile-identity">
                    <h2>{profile?.name || 'Cliente'}</h2>
                    <p>{profile?.contactEmail || profile?.email || ''}</p>
                    <span>{level}</span>
                </div>
            </section>

            <section className="profile-stats" aria-label="Resumen de tu cuenta">
                <article><strong>{profile?.visits || 0}</strong><span>Visitas</span></article>
                <article><strong>{points}</strong><span>Puntos</span></article>
                <article><strong>{level}</strong><span>Nivel</span></article>
            </section>

            <section className="appearance-card">
                <div><span>Apariencia</span><strong>Elige cómo quieres ver la app</strong></div>
                <div className="theme-switch" role="group" aria-label="Seleccionar apariencia">
                    <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><Sun size={16} /> Claro</button>
                    <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><Moon size={16} /> Oscuro</button>
                </div>
            </section>

            {(profile?.phone || profile?.birthDate || profile?.favoriteFlavor) && (
                <section className="profile-details">
                    {profile?.phone && <div><span>Teléfono</span><strong>{profile.phone}</strong></div>}
                    {profile?.birthDate && <div><span>Fecha de nacimiento</span><strong>{new Date(`${profile.birthDate}T12:00:00`).toLocaleDateString('es-SV')}</strong></div>}
                    {profile?.favoriteFlavor && <div><span>Sabor favorito</span><strong>{profile.favoriteFlavor}</strong></div>}
                </section>
            )}

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

            <button className="logout-button" onClick={logout}><LogOut size={17} /> Cerrar sesión</button>

            {editing && (
                <div className="edit-backdrop" onClick={() => !saving && setEditing(false)}>
                    <form className="edit-sheet" onSubmit={handleSave} onClick={event => event.stopPropagation()}>
                        <div className="edit-handle" />
                        <button type="button" className="edit-close" onClick={() => setEditing(false)} aria-label="Cerrar edición"><X size={18} /></button>
                        <div className="edit-heading"><span>Información personal</span><h2>Editar perfil</h2><p>Actualiza tus datos y preferencias.</p></div>

                        <div className="photo-editor">
                            <div className="photo-preview">{form.photoURL ? <img src={form.photoURL} alt="Vista previa" /> : initials}</div>
                            <button type="button" onClick={() => fileInput.current?.click()}><Camera size={16} /> Cambiar foto</button>
                            <input ref={fileInput} className="sr-only" type="file" accept="image/*" onChange={choosePhoto} />
                        </div>

                        <div className="edit-fields">
                            <label>Nombre completo<input name="name" value={form.name} onChange={updateField} autoComplete="name" required /></label>
                            <label>Teléfono<input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" placeholder="Ej. 7000-0000" /></label>
                            <label>Fecha de nacimiento<input name="birthDate" type="date" value={form.birthDate} onChange={updateField} /></label>
                            <label>Correo de contacto<input name="contactEmail" type="email" value={form.contactEmail} onChange={updateField} autoComplete="email" /></label>
                            <label>Sabor favorito<input name="favoriteFlavor" value={form.favoriteFlavor} onChange={updateField} placeholder="Ej. Mango" /></label>
                            <label className="linked-account">Cuenta vinculada<input value={user?.email || ''} readOnly /><small>Este correo pertenece a tu inicio de sesión con Google.</small></label>
                        </div>

                        {message && <p className={`edit-message ${message.type}`}>{message.text}</p>}
                        <button className="save-profile-button" disabled={saving}><Save size={17} /> {saving ? 'Guardando...' : 'Guardar cambios'}</button>
                    </form>
                </div>
            )}

            <style>{`
                .profile-page{display:flex;flex-direction:column;gap:19px}.profile-page .page-header{margin-bottom:0}.profile-header{display:flex;align-items:center;justify-content:space-between;gap:12px}.edit-profile-button{display:flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid #CDE9E4;border-radius:13px;background:#ECF9F6;color:var(--color-primary-ink);font-size:12px;font-weight:700;cursor:pointer}.profile-card{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;padding:22px;background:linear-gradient(145deg,#fff,#F0FAF7);border:1px solid #CFE9E4;border-radius:27px;box-shadow:0 14px 38px rgba(45,107,96,.1)}.profile-decoration{position:absolute;right:-38px;top:-55px;width:140px;height:140px;border-radius:50%;background:rgba(82,198,181,.14)}.profile-avatar{position:relative;flex:none;width:76px;height:76px;display:grid;place-items:center;overflow:hidden;border-radius:24px;background:linear-gradient(145deg,#8BE1D5,#55C4B4);color:#173F39;font-size:25px;font-weight:700;box-shadow:0 8px 22px rgba(82,191,175,.18)}.profile-avatar img,.photo-preview img{width:100%;height:100%;object-fit:cover}.profile-identity{position:relative;min-width:0}.profile-identity h2{font-family:'Cormorant Garamond',serif;font-size:25px;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.profile-identity p{margin:5px 0 9px;color:var(--color-text-secondary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.profile-identity span{display:inline-block;padding:4px 10px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-ink);font-size:11px;font-weight:700}.profile-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.profile-stats article{padding:15px 6px;display:flex;flex-direction:column;align-items:center;background:white;border:1px solid var(--color-border);border-radius:18px;box-shadow:0 5px 18px rgba(75,57,41,.05);min-width:0}.profile-stats strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;font-family:'Cormorant Garamond',serif;font-size:21px;color:var(--color-primary-ink)}.profile-stats span{margin-top:3px;color:var(--color-text-secondary);font-size:10px}.appearance-card{padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--color-border);border-radius:19px;background:var(--color-elevated);box-shadow:var(--shadow-card)}.appearance-card>div:first-child{display:flex;flex-direction:column;gap:2px}.appearance-card span{color:var(--color-text-secondary);font-size:10px}.appearance-card strong{font-size:12px}.theme-switch{display:flex;gap:3px;padding:4px;border-radius:14px;background:var(--color-bg)}.theme-switch button{min-height:36px;padding:0 9px;display:flex;align-items:center;gap:5px;border:0;border-radius:10px;background:transparent;color:var(--color-text-secondary);font-size:10px;font-weight:700;cursor:pointer}.theme-switch button.active{background:var(--color-elevated);color:var(--color-primary-ink);box-shadow:0 3px 10px rgba(0,0,0,.1)}.profile-details{display:grid;gap:1px;overflow:hidden;border:1px solid var(--color-border);border-radius:18px;background:var(--color-border)}.profile-details div{padding:12px 14px;display:flex;justify-content:space-between;gap:12px;background:white}.profile-details span{color:var(--color-text-secondary);font-size:11px}.profile-details strong{font-size:11px;text-align:right}.badges-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.badge-card{display:flex;align-items:center;gap:10px;min-height:78px;padding:12px;background:white;border:1px solid var(--color-border);border-radius:19px;box-shadow:0 5px 18px rgba(75,57,41,.045)}.badge-card>span{width:39px;height:39px;flex:none;display:grid;place-items:center;border-radius:12px}.badge-card div{min-width:0;display:flex;flex-direction:column}.badge-card strong{font-size:12px}.badge-card small{margin-top:3px;color:var(--color-text-secondary);font-size:9px;line-height:1.25}.logout-button{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #E6DDE4;border-radius:16px;background:white;color:var(--color-text-secondary);font-size:13px;font-weight:600;cursor:pointer}.edit-backdrop{position:fixed;inset:0;z-index:1400;display:flex;align-items:flex-end;justify-content:center;background:rgba(45,40,43,.32);backdrop-filter:blur(5px);animation:profileFade .2s ease}.edit-sheet{position:relative;width:100%;max-width:460px;max-height:92dvh;overflow-y:auto;padding:12px 22px calc(25px + env(safe-area-inset-bottom,0px));border-radius:30px 30px 0 0;background:#FCFBFC;box-shadow:0 -18px 50px rgba(43,35,40,.18);animation:profileSlide .32s cubic-bezier(.22,.9,.35,1)}.edit-handle{width:42px;height:5px;margin:0 auto 15px;border-radius:99px;background:#D9D2D8}.edit-close{position:absolute;top:18px;right:18px;width:36px;height:36px;display:grid;place-items:center;border:1px solid #E4DFE3;border-radius:50%;background:white;color:var(--color-text-secondary);cursor:pointer}.edit-heading{text-align:center}.edit-heading span{color:var(--color-primary-ink);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.edit-heading h2{margin:4px 0 2px;font-family:'Cormorant Garamond',serif;font-size:29px}.edit-heading p{color:var(--color-text-secondary);font-size:12px}.photo-editor{margin:17px 0;display:flex;flex-direction:column;align-items:center;gap:9px}.photo-preview{width:82px;height:82px;overflow:hidden;display:grid;place-items:center;border:5px solid #E4F6F2;border-radius:25px;background:#66CFC0;color:#173F39;font-size:24px;font-weight:700}.photo-editor button{display:flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--color-primary-ink);font-size:11px;font-weight:700;cursor:pointer}.edit-fields{display:grid;gap:12px}.edit-fields label{display:flex;flex-direction:column;gap:6px;color:var(--color-text-secondary);font-size:11px;font-weight:700}.edit-fields input{width:100%;height:46px;padding:0 13px;border:1px solid #DED7DC;border-radius:14px;background:white;color:var(--color-text);font-size:14px;outline:none}.edit-fields input:focus{border-color:#66CFC0;box-shadow:0 0 0 3px rgba(102,207,192,.16)}.linked-account input{background:#F3F0F2;color:#78716C}.linked-account small{font-weight:400;line-height:1.35}.edit-message{margin-top:12px;padding:10px 12px;border-radius:12px;font-size:11px}.edit-message.error{background:#FFF0E4;color:#9B4312}.save-profile-button{width:100%;min-height:49px;margin-top:17px;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:16px;background:linear-gradient(135deg,#78D8CA,#52BFAF);color:#173F39;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 8px 22px rgba(82,191,175,.22)}.save-profile-button:disabled{opacity:.65;cursor:wait}@keyframes profileFade{from{opacity:0}to{opacity:1}}@keyframes profileSlide{from{transform:translateY(100%)}to{transform:translateY(0)}}
            `}</style>
        </div>
    )
}
