import { useState } from 'react'
import { subirImagen } from '../services/api'
import { X, Plus, Minus } from 'lucide-react'

function Modal({ onClose, onGuardar, zapatoEditar, tallasExistentes = [] }) {
  const [modelo, setModelo] = useState(zapatoEditar?.modelo || '')
  const [precio, setPrecio] = useState(zapatoEditar?.precio || '')
  const [foto, setFoto] = useState(zapatoEditar?.foto || '')
  const [preview, setPreview] = useState(zapatoEditar?.foto || '')
  const [cargando, setCargando] = useState(false)

  // Inicializar cantidades de tallas existentes
  const contarTallasExistentes = () => {
    const conteo = {}
    tallasExistentes
      .filter(t => t.estado === 'Disponible')
      .forEach(t => {
        conteo[t.numero] = (conteo[t.numero] || 0) + 1
      })
    return conteo
  }

  const [cantidades, setCantidades] = useState(contarTallasExistentes)

  const tallas = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]

  const incrementar = (t) => {
    setCantidades(prev => ({ ...prev, [t]: (prev[t] || 0) + 1 }))
  }

  const decrementar = (t) => {
    setCantidades(prev => {
      const actual = prev[t] || 0
      if (actual <= 0) return prev
      return { ...prev, [t]: actual - 1 }
    })
  }

  const handleFoto = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setPreview(URL.createObjectURL(archivo))
    setCargando(true)
    const url = await subirImagen(archivo)
    setFoto(url)
    setCargando(false)
  }

  const handleGuardar = () => {
    if (!modelo || !precio) return
    const tallasNuevas = []
    Object.entries(cantidades).forEach(([numero, cantidad]) => {
      const existentes = tallasExistentes.filter(t => t.numero === parseInt(numero) && t.estado === 'Disponible').length
      const diferencia = cantidad - existentes
      for (let i = 0; i < diferencia; i++) {
        tallasNuevas.push(parseInt(numero))
      }
    })
    onGuardar({ modelo, precio: parseFloat(precio), foto, tallas: tallasNuevas })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-3 py-4 sm:px-4 sm:py-8 flex items-start sm:items-center justify-center" style={{backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4 sm:p-6 lg:p-8 relative max-h-[92vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pr-8">{zapatoEditar ? 'Editar Zapato' : 'Crear Zapato'}</h2>

        {/* Foto */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">FOTO</label>
          <div
            onClick={() => document.getElementById('inputFoto').click()}
            className="border-2 border-dashed border-gray-300 rounded-lg h-36 sm:h-40 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {preview
              ? <img src={preview} alt="preview" className="h-full w-full object-cover" />
              : <p className="text-gray-400 text-sm text-center px-4">Haz click para subir una foto</p>
            }
          </div>
          <input id="inputFoto" type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </div>

        {/* Modelo */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">MODELO</label>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un modelo</option>
            <option value="Deportivos">Deportivos</option>
            <option value="Casuales">Casuales</option>
            <option value="Botas">Botas</option>
            <option value="Botines">Botines</option>
            <option value="Tacos">Tacos</option>
            <option value="Pantuflas">Pantuflas</option>
            <option value="Muñecas">Muñecas</option>
            <option value="Botin de Trabajo">Botin de Trabajo</option>
            <option value="Pupillos">Pupillos</option>
            <option value="Escolares">Escolares</option>
          </select>
        </div>

        {/* Tallas con cantidades */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-2">TALLAS Y CANTIDADES</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 sm:max-h-48 overflow-y-auto pr-1">
            {tallas.map((t) => (
              <div key={t} className={`flex items-center justify-between gap-2 border rounded-lg px-2 py-2 ${cantidades[t] > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-sm font-semibold text-gray-700 w-6 shrink-0">{t}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => decrementar(t)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{cantidades[t] || 0}</span>
                  <button
                    type="button"
                    onClick={() => incrementar(t)}
                    className="text-gray-400 hover:text-blue-500 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-1">PRECIO</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGuardar}
            disabled={cargando}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {cargando ? 'Subiendo imagen...' : 'Guardar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}

export default Modal