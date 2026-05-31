import { useState, useEffect } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import { Menu } from 'lucide-react'

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchVentas = async () => {
      const response = await api.get('/ventas')
      setVentas(response.data)
    }
    fetchVentas()
  }, [])



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar paginaActiva="ventas" mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="mb-10">
          <button className="md:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
            <Menu size={20} />
          </button>
          <h2 className="text-3xl font-black text-gray-800">Historial de Ventas</h2>
          <p className="text-gray-500 mt-1">Registro de todas las ventas realizadas</p>
        </div>

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100/50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Foto</th>
                <th className="px-6 py-4 text-left">Modelo</th>
                <th className="px-6 py-4 text-left">Talla</th>
                <th className="px-6 py-4 text-left">Precio</th>
                <th className="px-6 py-4 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-100/30 transition">
                  <td className="px-6 py-4">
                    <img src={venta.foto} alt={venta.modelo} className="w-14 h-14 object-cover rounded-xl" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{venta.modelo}</td>
                  <td className="px-6 py-4 text-gray-300">{venta.numero_talla}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">${venta.precio}</td>
                  <td className="px-6 py-4 text-gray-500">{venta.fecha_venta}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {ventas.length === 0 && (
            <p className="text-center text-gray-500 py-10">No hay ventas registradas aún</p>
          )}
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {ventas.map((venta) => (
            <div key={venta.id} className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex gap-4">
                <img src={venta.foto} alt={venta.modelo} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800">{venta.modelo}</h3>
                  <p className="text-gray-500 text-sm">Talla {venta.numero_talla}</p>
                  <p className="text-blue-400 font-bold">${venta.precio}</p>
                  <p className="text-gray-500 text-xs mt-1">{venta.fecha_venta}</p>
                </div>
              </div>
            </div>
          ))}
          {ventas.length === 0 && (
            <p className="text-center text-gray-500 py-10">No hay ventas registradas aún</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Ventas