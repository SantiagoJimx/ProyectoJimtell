import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function ZapatoCard({ zapato, tallas = [] }) {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/zapato/${zapato.codigo}`)}
      className="
        group
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        overflow-hidden
        border border-white/20
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-500
        cursor-pointer
      "
    >
      {/* imagen */}
      <div className="relative overflow-hidden h-72 bg-gray-100">
        
        <img
          src={zapato.foto}
          alt={zapato.modelo}
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-110
            transition-transform
            duration-700
          "
        />

        {/* overlay */}
        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-black/60
          via-transparent
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition
        " />

        {/* badge */}
        <div className="
          absolute top-4 left-4
          bg-blue-600
          text-white
          text-xs
          px-3 py-1
          rounded-full
          font-semibold
          shadow-lg
        ">
          Disponible
        </div>
      </div>

      {/* contenido */}
      <div className="p-5">
        
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {zapato.modelo}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Calzado premium
            </p>
          </div>

          <span className="text-2xl font-black text-blue-600">
            ${zapato.precio}
          </span>
        </div>

        {/* tallas */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[...new Set(tallas.map(t => t.numero))]
            .sort((a, b) => a - b)
            .map(numero => (
              <span
                key={numero}
                className="
                  px-3 py-1
                  rounded-full
                  bg-gray-100
                  text-gray-700
                  text-xs
                  font-semibold
                  hover:bg-blue-100
                  hover:text-blue-700
                  transition
                "
              >
                {numero}
              </span>
            ))}
        </div>

        {/* botón */}
        <button className="
          w-full
          mt-6
          bg-gray-900
          hover:bg-blue-600
          text-white
          py-3
          rounded-xl
          font-semibold
          transition-all
          duration-300
        ">
          Ver detalles
        </button>
      </div>
    </motion.div>
  )
}

export default ZapatoCard