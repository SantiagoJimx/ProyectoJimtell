import { useNavigate } from 'react-router-dom'

function ZapatoCard({ zapato }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/zapato/${zapato.modelo}`)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
    >
      <img
        src={zapato.foto}
        alt={zapato.modelo}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{zapato.modelo}</h3>
        <p className="text-sm text-gray-400">Talla: {zapato.talla}</p>
        <p className="text-blue-600 font-bold mt-1">€{zapato.precio}</p>
      </div>
    </div>
  )
}

export default ZapatoCard