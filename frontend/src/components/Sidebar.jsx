import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, History, LogOut, Settings, ChevronDown, X } from 'lucide-react'

function Sidebar({ paginaActiva, onConfiguracion, mobileOpen = false, onClose }) {
  const navigate = useNavigate()
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  const token = localStorage.getItem('token')
  const payload = JSON.parse(atob(token.split('.')[1]))
  const rol = payload.rol
  const usuario = payload.sub
  const esAdmin = rol === 'Administrador'

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { label: 'Inventario', icon: LayoutDashboard, ruta: '/inventario', key: 'inventario' },
    ...(esAdmin ? [{ label: 'Staff', icon: Users, ruta: '/trabajadores', key: 'trabajadores' }] : []),
    { label: 'Ventas', icon: History, ruta: '/ventas', key: 'ventas' },
    ...(esAdmin ? [{ label: 'Configuración', icon: Settings, key: 'config', accion: onConfiguracion }] : []),
  ]

  const base = (
    <div>
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black text-blue-600">JimTell</h1>
        <p className="text-gray-400 text-xs mt-1">{esAdmin ? 'Panel Administrador' : 'Panel Vendedor'}</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const activo = paginaActiva === item.key
          return (
            <button
              key={item.key}
              onClick={() => item.accion ? item.accion() : item.ruta ? navigate(item.ruta) : null}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                ${activo ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Perfil */}
      <div className="relative">
        <button
          onClick={() => setMostrarPerfil(!mostrarPerfil)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {usuario?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-800 truncate">{usuario}</p>
            <p className="text-xs text-gray-400">{rol}</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${mostrarPerfil ? 'rotate-180' : ''}`} />
        </button>

        {mostrarPerfil && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{usuario}</p>
              <p className="text-xs text-gray-400">{rol}</p>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 text-sm transition">
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Mobile drawer mode
  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="absolute left-0 top-0 bottom-0 w-64">
          <div className="h-full bg-white border-r border-gray-200 flex flex-col justify-between py-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-blue-600">JimTell</h1>
                <p className="text-gray-400 text-xs mt-1">{esAdmin ? 'Panel Administrador' : 'Panel Vendedor'}</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            {base}
          </div>
        </div>
      </div>
    )
  }

  // Desktop: visible, Mobile: hidden (use drawer)
  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col justify-between py-6 px-4 shrink-0">
      {base}
    </aside>
  )
}

export default Sidebar