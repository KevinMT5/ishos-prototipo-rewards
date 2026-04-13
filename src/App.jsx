import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Home from './pages/Home'
import Rewards from './pages/Rewards'
import History from './pages/History'
import Profile from './pages/Profile'

export default function App() {
  const { user, loading } = useAuth()

  // Pantalla de carga mientras Firebase verifica la sesión
  if (loading) {
    return (
      <div style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFBF5',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <span style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>🍧</span>
        <p style={{ fontSize: '14px', color: '#A8A29E' }}>Cargando...</p>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // Si no hay sesión → Login
  if (!user) return <Login />

  // Sesión activa → App principal
  return (
    <div style={{
      maxWidth: '430px',
      margin: '0 auto',
      minHeight: '100svh',
      background: '#FFFBF5',
      position: 'relative',
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      {/* Contenido con espacio para el bottom nav */}
      <div style={{ paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  )
}