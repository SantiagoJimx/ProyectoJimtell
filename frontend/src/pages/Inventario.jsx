import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Modal from '../components/Modal'
import Sidebar from '../components/Sidebar'
import { Menu } from 'lucide-react'
import { Plus, Pencil, Trash2, Check, X, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import ModalConfirmacion from '../components/ModalConfirmacion'

function Inventario() {
  const [zapatos, setZapatos] = useState([])
  const [tallasMap, setTallasMap] = useState({})
  const [totalVentas, setTotalVentas] = useState(0)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalVender, setMostrarModalVender] = useState(false)
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)
  const [mostrarConfigModal, setMostrarConfigModal] = useState(false)
  const [zapatoEditar, setZapatoEditar] = useState(null)
  const [zapatoVender, setZapatoVender] = useState(null)
  const [zapatoEliminar, setZapatoEliminar] = useState(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [whatsappInput, setWhatsappInput] = useState('')
  const [filtroModelo, setFiltroModelo] = useState('')
  const [filtroTalla, setFiltroTalla] = useState('')
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const token = localStorage.getItem('token')
  const payload = JSON.parse(atob(token.split('.')[1]))
  const rol = payload.rol
  const esAdmin = rol === 'Administrador'

  // Estados
  const [confirmacion, setConfirmacion] = useState(null)

  // Función helper
  const confirmar = (mensaje, accion) => {
    setConfirmacion({ mensaje, accion })
  }

  useEffect(() => {
    fetchZapatos()
    fetchTotalVentas()
    fetchConfiguracion()
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

  const fetchTotalVentas = async () => {
    const response = await api.get('/ventas')
    setTotalVentas(response.data.length)
  }

  const fetchConfiguracion = async () => {
    try {
      const response = await api.get('/configuracion')
      if (response.data) setWhatsapp(response.data.whatsapp)
    } catch {}
  }

  const handleGuardarWhatsapp = async () => {
    await api.put('/configuracion', { whatsapp: whatsappInput })
    setWhatsapp(whatsappInput)
    setMostrarConfigModal(false)
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

  const handleVenderTalla = async (tallaId, numero) => {
    confirmar(
      `¿Confirmas vender la talla ${numero}?`,
      async () => {
        await api.put(`/tallas/${tallaId}/vender`)
        setMostrarModalVender(false)
        setZapatoVender(null)
        fetchZapatos()
        fetchTotalVentas()
        setConfirmacion(null)
      }
    )
  }

  const handleEliminarTalla = async (tallaId, numero) => {
    confirmar(
      `¿Eliminar la talla ${numero}?`,
      async () => {
        await api.delete(`/tallas/${tallaId}`)
        setMostrarModalEliminar(false)
        setZapatoEliminar(null)
        fetchZapatos()
        setConfirmacion(null)
      }
    )
  }

  const totalInventario = zapatos.length
  const disponibles = Object.values(tallasMap).flat().filter(t => t.estado === 'Disponible').length

  const modelos = [...new Set(zapatos.map(z => z.modelo))]
  const tallasDisponibles = [...new Set(
    Object.values(tallasMap).flat()
      .filter(t => t.estado === 'Disponible')
      .map(t => t.numero)
  )].sort((a, b) => a - b)

  const zapatosVisibles = zapatos.filter(z => {
    const tallas = tallasMap[z.id] || []
    const coincideModelo = filtroModelo === '' || z.modelo === filtroModelo
    const coincideTalla = filtroTalla === '' || tallas.some(t => t.estado === 'Disponible' && String(t.numero) === filtroTalla)
    const tieneDisponibles = tallas.some(t => t.estado === 'Disponible')
    return coincideModelo && coincideTalla && tieneDisponibles
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar paginaActiva="inventario" onConfiguracion={() => { setWhatsappInput(whatsapp); setMostrarConfigModal(true) }} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 md:p-10 overflow-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <button className="md:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">Inventario</h2>
            <p className="text-gray-500 mt-1">Gestiona los productos disponibles</p>
          </div>
          {esAdmin && (
            <button
              onClick={() => { setZapatoEditar(null); setMostrarModal(true) }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-800 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition"
            >
              <Plus size={18} /> Añadir Producto
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Modelos', value: totalInventario, color: 'text-gray-800' },
            { label: 'Tallas Vendidas', value: totalVentas, color: 'text-blue-400' },
            { label: 'Tallas Disponibles', value: disponibles, color: 'text-green-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-200">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className={`text-3xl md:text-4xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filtroModelo}
            onChange={(e) => setFiltroModelo(e.target.value)}
            className="bg-gray-10 border border-gray-600 text-gray-800 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los modelos</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={filtroTalla}
            onChange={(e) => setFiltroTalla(e.target.value)}
            className="bg-gray-100 border border-gray-600 text-gray-800 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las tallas</option>
            {tallasDisponibles.map(t => <option key={t} value={t}>Talla {t}</option>)}
          </select>
        </div>

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-100/50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Foto</th>
                <th className="px-6 py-4 text-left">Modelo</th>
                <th className="px-6 py-4 text-left">Tallas Disponibles</th>
                <th className="px-6 py-4 text-left">Precio</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zapatosVisibles.map((zapato) => (
                <tr key={zapato.id} className="hover:bg-gray-100/30 transition">
                  <td className="px-6 py-4">
                    <img src={zapato.foto} alt={zapato.modelo} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{zapato.modelo}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(tallasMap[zapato.id] || []).filter(t => t.estado === 'Disponible').map(t => (
                        <span key={t.id} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-lg border border-blue-600/30">
                          {t.numero}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-400 font-bold text-lg">${zapato.precio}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setZapatoVender(zapato); setMostrarModalVender(true) }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600/30 transition" title="Vender talla">
                        <Check size={16} />
                      </button>
                      {esAdmin && (
                        <>
                          <button onClick={() => { setZapatoEditar(zapato); setMostrarModal(true) }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600/30 transition" title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => { setZapatoEliminar(zapato); setMostrarModalEliminar(true) }}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600/30 transition" title="Eliminar talla">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {zapatosVisibles.map((zapato) => (
            <div key={zapato.id} className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200">
              <div className="flex gap-4">
                <img src={zapato.foto} alt={zapato.modelo} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800">{zapato.modelo}</h3>
                  <p className="text-blue-400 font-bold mt-1 text-lg sm:text-xl">${zapato.precio}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(tallasMap[zapato.id] || []).filter(t => t.estado === 'Disponible').map(t => (
                      <span key={t.id} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-lg border border-blue-600/30">
                        {t.numero}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setZapatoVender(zapato); setMostrarModalVender(true) }}
                      className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Check size={16} />
                    </button>
                    {esAdmin && (
                      <>
                        <button onClick={() => { setZapatoEditar(zapato); setMostrarModal(true) }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => { setZapatoEliminar(zapato); setMostrarModalEliminar(true) }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modales */}
      {esAdmin && mostrarModal && (
        <Modal
          onClose={() => { setMostrarModal(false); setZapatoEditar(null) }}
          onGuardar={zapatoEditar ? handleEditar : handleCrear}
          zapatoEditar={zapatoEditar}
          tallasExistentes={zapatoEditar ? (tallasMap[zapatoEditar.id] || []) : []}
        />
      )}

      {mostrarModalVender && zapatoVender && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Marcar talla como vendida</h2>
            <p className="text-gray-500 text-sm mb-6">Selecciona la talla vendida de <span className="font-semibold text-gray-800">{zapatoVender.modelo}</span></p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
              {(tallasMap[zapatoVender.id] || []).filter(t => t.estado === 'Disponible').map(t => (
                <button key={t.id} onClick={() => handleVenderTalla(t.id, t.numero)}
                  className="py-2 rounded-xl text-sm font-semibold border border-gray-600 text-gray-300 hover:bg-green-600/20 hover:border-green-500 hover:text-green-400 transition">
                  {t.numero}
                </button>
              ))}
            </div>
            <button onClick={() => { setMostrarModalVender(false); setZapatoVender(null) }}
              className="w-full border border-gray-600 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {esAdmin && mostrarModalEliminar && zapatoEliminar && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Eliminar talla</h2>
            <p className="text-gray-500 text-sm mb-6">Selecciona la talla a eliminar de <span className="font-semibold text-gray-800">{zapatoEliminar.modelo}</span></p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
              {(tallasMap[zapatoEliminar.id] || []).filter(t => t.estado === 'Disponible').map(t => (
                <button key={t.id} onClick={() => handleEliminarTalla(t.id, t.numero)}
                  className="py-2 rounded-xl text-sm font-semibold border border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400 transition">
                  {t.numero}
                </button>
              ))}
            </div>
            <button onClick={() => { setMostrarModalEliminar(false); setZapatoEliminar(null) }}
              className="w-full border border-gray-600 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarConfigModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setMostrarConfigModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configuración</h2>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 mb-1">NÚMERO DE WHATSAPP</label>
              <input
                type="text"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                className="w-full bg-gray-100 border border-gray-600 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="593XXXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">Incluye el código de país sin el + (ej: 593987654321)</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGuardarWhatsapp}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-gray-800 font-semibold py-2 rounded-xl transition">
                Guardar
              </button>
              <button onClick={() => setMostrarConfigModal(false)}
                className="flex-1 border border-gray-600 text-gray-500 py-2 rounded-xl hover:bg-gray-100 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmacion && (
        <ModalConfirmacion
          mensaje={confirmacion.mensaje}
          onConfirmar={confirmacion.accion}
          onCancelar={() => setConfirmacion(null)}
        />
      )}
    </div>
  )
}

export default Inventario