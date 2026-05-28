import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { GiRunningShoe } from 'react-icons/gi'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams()
      params.append('username', usuario)
      params.append('password', password)
      const response = await api.post('/login', params)
      localStorage.setItem('token', response.data.access_token)
      navigate('/inventario')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden w-full max-w-3xl">

        {/* Formulario izquierda */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-1">Inicio de Sesión</h1>
          <p className="text-center text-gray-400 text-sm mb-8">Ingresa tus credenciales por favor</p>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">USUARIO</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="usuario"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1">CONTRASEÑA</label>
            <div className="relative">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                style={{ WebkitTextSecurity: mostrarPassword ? 'none' : 'disc' }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
              >
                {mostrarPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Iniciar Sesión →
          </button>

          <p
            onClick={() => navigate('/')}
            className="text-center text-sm text-gray-400 mt-6 cursor-pointer hover:text-blue-500"
          >
            ← Volver al catálogo principal
          </p>
        </div>

        {/* Imagen derecha */}
        <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center p-10">
          <div className="text-center text-gray-500">
            <GiRunningShoe size={80} className="text-gray-400 mb-4 mx-auto" />
            <p className="text-2xl font-bold mb-2">Bienvenido</p>
            <p className="text-sm">Logística y Gestión Profesional de Calzado</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login