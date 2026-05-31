import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'

function ZapatoDetalle() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [zapatos, setZapatos] = useState([])
  const [tallasMap, setTallasMap] = useState({})
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const [zapatoRes, configRes] = await Promise.all([
        api.get(`/zapatos/${id}`),
        api.get('/configuracion')
      ])

      const zapatoData = zapatoRes.data

      setZapatos([zapatoData])

      if (configRes.data) {
        setWhatsapp(configRes.data.whatsapp)
      }

      const res = await api.get(
        `/zapatos/${zapatoData.id}/tallas`
      )

      setTallasMap({
        [zapatoData.id]: res.data.filter(
          t => t.estado === 'Disponible'
        )
      })
    }

    fetchData()
  }, [id])

  const handleWhatsapp = (zapato) => {
    const urlZapato =
      `${window.location.origin}/zapato/${zapato.modelo}`

    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en este producto: ${urlZapato}`
    )

    window.open(
      `https://wa.me/${whatsapp}?text=${mensaje}`,
      '_blank'
    )
  }

  const tallasDisponibles = Object.values(tallasMap).flat()

  const numeros = [
    ...new Set(tallasDisponibles.map(t => t.numero))
  ].sort((a, b) => a - b)

  const zapato = zapatos[0]

  if (!zapato) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* navbar */}
      <div
        className="
          fixed top-0 left-0 w-full z-50
          backdrop-blur-xl
          bg-white/70
          border-b border-white/20
        "
      >
        <div className="px-8 py-4 flex items-center justify-between">

          <button
            onClick={() => navigate('/')}
            className="
              flex items-center gap-2
              text-gray-600
              hover:text-blue-600
              transition
              font-medium
            "
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <h1 className="text-xl font-black text-blue-600">
            JimTell
          </h1>
        </div>
      </div>

      {/* contenido */}
      <div className="pt-32 px-8 md:px-16 pb-16">

        <div
          className="
            max-w-7xl mx-auto
            grid md:grid-cols-2
            gap-14
            items-center
          "
        >

          {/* imagen */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="
              relative
              rounded-[40px]
              overflow-hidden
              shadow-2xl
              bg-white
            "
          >
            <div className="
              absolute top-5 left-5 z-10
              bg-blue-600
              text-white
              px-4 py-2
              rounded-full
              text-sm
              font-semibold
              shadow-lg
            ">
              Nuevo
            </div>

            <img
              src={zapato.foto}
              alt={zapato.modelo}
              className="
                w-full
                h-[650px]
                object-cover
                hover:scale-105
                transition-transform
                duration-700
              "
            />
          </motion.div>

          {/* info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            <h1 className="
              text-5xl
              font-black
              text-gray-900
              leading-tight
            ">
              {zapato.modelo}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              
              <span className="
                text-4xl
                font-black
                text-blue-600
              ">
                ${zapato.precio}
              </span>

              <div className="
                bg-green-100
                text-green-700
                px-3 py-1
                rounded-full
                text-sm
                font-semibold
              ">
                Disponible
              </div>
            </div>

            <p className="
              mt-8
              text-gray-600
              leading-relaxed
              text-lg
            ">
              Diseño moderno, excelente comodidad y
              materiales premium para uso diario.
            </p>

            {/* tallas */}
            <div className="mt-10">
              
              <h3 className="
                text-sm
                font-bold
                tracking-[2px]
                text-gray-500
                uppercase
                mb-4
              ">
                Tallas disponibles
              </h3>

              <div className="flex flex-wrap gap-3">
                {numeros.length > 0 ? (
                  numeros.map(n => (
                    <button
                      key={n}
                      className="
                        w-14 h-14
                        rounded-2xl
                        bg-white
                        border border-gray-200
                        hover:border-blue-500
                        hover:bg-blue-50
                        hover:text-blue-600
                        transition-all
                        font-semibold
                        shadow-sm
                      "
                    >
                      {n}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400">
                    Sin stock disponible
                  </p>
                )}
              </div>
            </div>

            {/* botones */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">

              {whatsapp && (
                <button
                  onClick={() => handleWhatsapp(zapato)}
                  className="
                    flex-1
                    bg-green-500
                    hover:bg-green-600
                    text-white
                    py-4
                    rounded-2xl
                    font-bold
                    flex items-center
                    justify-center
                    gap-3
                    shadow-xl
                    hover:scale-[1.02]
                    transition-all
                  "
                >
                  <MessageCircle size={22} />
                  Consultar por WhatsApp
                </button>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ZapatoDetalle