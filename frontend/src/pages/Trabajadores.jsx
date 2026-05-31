import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Menu } from 'lucide-react'

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [trabajadorEditar, setTrabajadorEditar] = useState(null)
  const [usuario, setUsuario] = useState('')
  
  
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const token = localStorage.getItem('token')
  const payload = JSON.parse(atob(token.split('.')[1]))
  const esAdmin = payload.rol === 'Administrador'

  useEffect(() => {
    if (!esAdmin) { navigate('/inventario'); return }
    fetchTrabajadores()
  }, [])


  const fetchTrabajadores = async () => {
    try {
      const response = await api.get('/trabajadores')
      setTrabajadores(response.data.filter(t => t.rol === 'Vendedor'))
    } catch (err) {
      console.error('Error fetching trabajadores', err)
      if (err?.response?.status === 401) {
        // Token invalid or expired: clear and redirect to login
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  const handleGuardar = async () => {
    if (!usuario || !password) return
    if (trabajadorEditar) {
      await api.put(`/trabajadores/${trabajadorEditar.usuario}`, { usuario, password, rol: 'Vendedor' })
    } else {
      await api.post('/trabajadores', { usuario, password, rol: 'Vendedor' })
    }
    cerrarModal()
    fetchTrabajadores()
  }

  const handleEliminar = async (u) => {
    if (confirm('¿Eliminar este vendedor?')) {
      await api.delete(`/trabajadores/${u}`)
      fetchTrabajadores()
    }
  }

  const abrirEditar = (t) => {
    setTrabajadorEditar(t)
    setUsuario(t.usuario)
    setPassword('')
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setTrabajadorEditar(null)
    setUsuario('')
    setPassword('')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar paginaActiva="trabajadores" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <button className="md:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-800">Gestión de Staff</h2>
            <p className="text-gray-500 mt-1">Administra los vendedores del sistema</p>
          </div>
          <button
            onClick={() => { setTrabajadorEditar(null); setMostrarModal(true) }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-800 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition"
          >
            <Plus size={18} /> Crear Vendedor
          </button>
        </div>

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100/50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Usuario</th>
                <th className="px-6 py-4 text-left">Contraseña</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trabajadores.map((t) => (
                <tr key={t.usuario} className="hover:bg-gray-100/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-gray-800">
                        {t.usuario.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{t.usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 tracking-widest">••••••••••</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(t)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600/30 transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleEliminar(t.usuario)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600/30 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trabajadores.length === 0 && (
            <p className="text-center text-gray-500 py-10">No hay vendedores registrados aún</p>
          )}
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {trabajadores.map((t) => (
            <div key={t.usuario} className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-gray-800">
                  {t.usuario.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.usuario}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirEditar(t)}
                  className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                  Editar
                </button>
                <button onClick={() => handleEliminar(t.usuario)}
                  className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={cerrarModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{trabajadorEditar ? 'Editar Vendedor' : 'Crear Vendedor'}</h2>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1">USUARIO</label>
              <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-gray-100 border border-gray-600 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="nombre de usuario" />
            </div>


            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 mb-1">CONTRASEÑA</label>
              <div className="relative">
                <input type={mostrarPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                  className="w-full bg-gray-100 border border-gray-600 text-gray-800 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleGuardar}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-gray-800 font-semibold py-2 rounded-xl transition">
                Guardar
              </button>
              <button onClick={cerrarModal}
                className="flex-1 border border-gray-600 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trabajadores