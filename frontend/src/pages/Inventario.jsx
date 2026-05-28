import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Modal from '../components/Modal'
import { Plus, Pencil, Trash2, Check, LayoutDashboard, Users, History, LogOut } from 'lucide-react'

function Inventario() {
  const [zapatos, setZapatos] = useState([])
  const [tallasMap, setTallasMap] = useState({})
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalVender, setMostrarModalVender] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [zapatoEditar, setZapatoEditar] = useState(null)
  const [zapatoVender, setZapatoVender] = useState(null)
  const [zapatoEliminar, setZapatoEliminar] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchZapatos()
  }, [])

  const fetchZapatos = async () => {
    const response = await api.get('/zapatos')
    setZapatos(response.data)
    fetchTallas(response.data)
  }

  const fetchTallas = async (zapatos) => {
    const map = {}
    for (const z of zapatos) {
      const response = await api.get(`/zapatos/${z.id}/tallas`)
      map[z.id] = response.data
    }
    setTallasMap(map)
  }

  const handleCrear = async (datos) => {
    const { tallas, ...zapatoDatos } = datos
    await api.post('/zapatos', { ...zapatoDatos, tallas })
    setMostrarModal(false)
    fetchZapatos()
  }

  const handleEditar = async (datos) => {
    const { tallas, ...zapatoDatos } = datos
    await api.put(`/zapatos/${zapatoEditar.id}`, { ...zapatoDatos, tallas })
    setMostrarModal(false)
    setZapatoEditar(null)
    fetchZapatos()
  }

  const handleVenderTalla = async (tallaId) => {
    await api.put(`/tallas/${tallaId}/vender`)
    setMostrarModalVender(false)
    setZapatoVender(null)
    fetchZapatos()
  }

  const handleEliminarTalla = async (tallaId) => {
    await api.delete(`/tallas/${tallaId}`)
    setMostrarModalEliminar(false)
    setZapatoEliminar(null)
    fetchZapatos()
  }

  const handleEliminarZapato = async (id) => {
    if (confirm('¿Eliminar el zapato completo con todas sus tallas?')) {
      await api.delete(`/zapatos/${id}`)
      setMostrarModalEliminar(false)
      setZapatoEliminar(null)
      fetchZapatos()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const totalInventario = zapatos.length
  const vendidos = Object.values(tallasMap).flat().filter(t => t.estado === 'Vendido').length
  const disponibles = Object.values(tallasMap).flat().filter(t => t.estado === 'Disponible').length

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-56 bg-white shadow-sm flex flex-col justify-between py-6 px-4">
        <div>
          <h1 className="font-bold text-lg mb-1">Admin Panel</h1>
          <p className="text-gray-400 text-xs mb-8">Jimtell</p>
          <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold">
              <LayoutDashboard size={16} /> Inventory
            </button>
            <button
              onClick={() => navigate('/trabajadores')}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg text-sm"
            >
              <Users size={16} /> Staff
            </button>
            <button
              onClick={() => navigate('/ventas')}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg text-sm"
            >
              <History size={16} /> Sales History
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm px-3 py-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gestión de Productos</h2>
          <button
            onClick={() => { setZapatoEditar(null); setMostrarModal(true) }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            <Plus size={16} /> Añadir Producto
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-400 text-sm">Total Modelos</p>
            <p className="text-3xl font-bold text-gray-800">{totalInventario}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-400 text-sm">Tallas Vendidas</p>
            <p className="text-3xl font-bold text-gray-800">{vendidos}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-400 text-sm">Tallas Disponibles</p>
            <p className="text-3xl font-bold text-green-500">{disponibles}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Foto</th>
                <th className="px-6 py-3 text-left">Modelo</th>
                <th className="px-6 py-3 text-left">Tallas Disponibles</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {zapatos.map((zapato) => (
                <tr key={zapato.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={zapato.foto} alt={zapato.modelo} className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{zapato.modelo}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(tallasMap[zapato.id] || [])
                        .filter(t => t.estado === 'Disponible')
                        .map(t => (
                          <span key={t.id} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {t.numero}
                          </span>
                        ))
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-bold">€{zapato.precio}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setZapatoVender(zapato); setMostrarModalVender(true) }}
                        className="text-green-500 hover:text-green-700"
                        title="Marcar talla como vendida"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => { setZapatoEditar(zapato); setMostrarModal(true) }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => { setZapatoEliminar(zapato); setMostrarModalEliminar(true) }}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {mostrarModal && (
        <Modal
          onClose={() => { setMostrarModal(false); setZapatoEditar(null) }}
          onGuardar={zapatoEditar ? handleEditar : handleCrear}
          zapatoEditar={zapatoEditar}
        />
      )}

      {/* Modal vender talla */}
      {mostrarModalVender && zapatoVender && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Marcar talla como vendida</h2>
            <p className="text-gray-400 text-sm mb-6">Selecciona la talla vendida de <span className="font-semibold text-gray-700">{zapatoVender.modelo}</span></p>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {(tallasMap[zapatoVender.id] || [])
                .filter(t => t.estado === 'Disponible')
                .map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleVenderTalla(t.id)}
                    className="py-2 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition"
                  >
                    {t.numero}
                  </button>
                ))
              }
            </div>
            <button
              onClick={() => { setMostrarModalVender(false); setZapatoVender(null) }}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal eliminar talla */}
      {mostrarModalEliminar && zapatoEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Eliminar talla</h2>
            <p className="text-gray-400 text-sm mb-6">Selecciona la talla a eliminar de <span className="font-semibold text-gray-700">{zapatoEliminar.modelo}</span></p>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {(tallasMap[zapatoEliminar.id] || [])
                .filter(t => t.estado === 'Disponible')
                .map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleEliminarTalla(t.id)}
                    className="py-2 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition"
                  >
                    {t.numero}
                  </button>
                ))
              }
            </div>
            <button
              onClick={() => handleEliminarZapato(zapatoEliminar.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mb-2 text-sm font-semibold"
            >
              Eliminar zapato completo
            </button>
            <button
              onClick={() => { setMostrarModalEliminar(false); setZapatoEliminar(null) }}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Inventario