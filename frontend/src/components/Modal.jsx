import { useState } from 'react'
import { subirImagen } from '../services/api'
import { X } from 'lucide-react'

function Modal({ onClose, onGuardar, zapatoEditar }) {
  const [modelo, setModelo] = useState(zapatoEditar?.modelo || '')
  const [tallas, setTallas] = useState(zapatoEditar?.tallas || [])
  const [precio, setPrecio] = useState(zapatoEditar?.precio || '')
  const [foto, setFoto] = useState(zapatoEditar?.foto || '')
  const [preview, setPreview] = useState(zapatoEditar?.foto || '')
  const [cargando, setCargando] = useState(false)

  const handleFoto = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setPreview(URL.createObjectURL(archivo))
    setCargando(true)
    const url = await subirImagen(archivo)
    setFoto(url)
    setCargando(false)
  }

  const toggleTalla = (t) => {
  setTallas(prev => 
    prev.includes(t) ? prev.filter(n => n !== t) : [...prev, t]
  )
}

    const handleGuardar = () => {
    if (!modelo || tallas.length === 0 || !precio) return
    onGuardar({ modelo, tallas, precio: parseFloat(precio), foto, estado: 'Disponible' })
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.3)'}}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">{zapatoEditar ? 'Editar Zapato' : 'Crear Zapato'}</h2>

        {/* Foto */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">FOTO</label>
          <div
            onClick={() => document.getElementById('inputFoto').click()}
            className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {preview
              ? <img src={preview} alt="preview" className="h-full object-cover" />
              : <p className="text-gray-400 text-sm">Haz click para subir una foto</p>
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Talla */}
        <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 mb-1">TALLA</label>
        <div className="grid grid-cols-6 gap-2">
            {[16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((t) => (
            <button
                key={t}
                type="button"
                onClick={() => toggleTalla(t)}
                className={`py-2 rounded-lg text-sm font-semibold border transition ${
                tallas.includes(t)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
            >
                {t}
            </button>
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGuardar}
            disabled={cargando}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {cargando ? 'Subiendo imagen...' : 'Guardar'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}

export default Modal