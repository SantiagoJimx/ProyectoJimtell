import { useNavigate } from 'react-router-dom'

function Navbar({ onFiltroModelo, onFiltroTalla, modelos, tallas }) {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      
      <h1 className="text-blue-600 font-bold text-xl">JimTell</h1>

      <div className="flex gap-4">
        <select
          onChange={(e) => onFiltroModelo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Modelo</option>
          {modelos.map((modelo, i) => (
            <option key={i} value={modelo}>{modelo}</option>
          ))}
        </select>

        <select
          onChange={(e) => onFiltroTalla(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Talla</option>
          {tallas.map((talla, i) => (
            <option key={i} value={talla}>{talla}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => navigate('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
      >
        Admin Login
      </button>

    </nav>
  )
}

export default Navbar