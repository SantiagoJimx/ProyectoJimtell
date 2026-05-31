import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import Navbar from '../components/Navbar'
import ZapatoCard from '../components/ZapatoCard'
import api from '../services/api'

function Home() {
  const [zapatos, setZapatos] = useState([])
  const [tallasMap, setTallasMap] = useState({})
  const [zapatoHero, setZapatoHero] = useState(null)

  const [filtroModelo, setFiltroModelo] = useState('')
  const [filtroTalla, setFiltroTalla] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/zapatos')

      const todos = response.data

      const map = {}

      for (const z of todos) {
        const res = await api.get(`/zapatos/${z.id}/tallas`)

        map[z.id] = res.data.filter(
          t => t.estado === 'Disponible'
        )
      }

      setTallasMap(map)

      const disponibles = todos.filter(
        z => map[z.id]?.length > 0
      )

      setZapatos(disponibles)

      if (disponibles.length > 0) {
        const random =
          disponibles[
            Math.floor(Math.random() * disponibles.length)
          ]

        setZapatoHero(random)
      }
    }

    fetchData()
  }, [])

  const modelos = [...new Set(zapatos.map(z => z.modelo))]

  const tallas = [
    ...new Set(
      Object.values(tallasMap)
        .flat()
        .map(t => t.numero)
    )
  ].sort((a, b) => a - b)

  const zapatosFiltrados = zapatos.filter(z => {
    const porModelo = filtroModelo
      ? z.modelo === filtroModelo
      : true

    const porTalla = filtroTalla
      ? (tallasMap[z.id] || []).some(
          t => t.numero === parseInt(filtroTalla)
        )
      : true

    return porModelo && porTalla
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      <Navbar />

      {/* HERO */}
      {zapatoHero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="
            relative
            h-auto md:h-[580px]
            overflow-hidden
            bg-gradient-to-br
            from-gray-900
            via-gray-800
            to-black
          "
        >

          {/* círculos decorativos */}
          <div className="
            absolute
            top-[-120px]
            right-[-100px]
            w-[400px]
            h-[400px]
            bg-blue-600/20
            rounded-full
            blur-3xl
          " />

          <div className="
            absolute
            bottom-[-100px]
            left-[-100px]
            w-[300px]
            h-[300px]
            bg-blue-400/10
            rounded-full
            blur-3xl
          " />

          <div className="
            relative
            h-full
            px-8 md:px-16
            flex
            flex-col-reverse
            md:flex-row
            items-center
            justify-between
            gap-10
          ">

            {/* TEXTO */}
            <div className="
              z-10
              text-white
              max-w-2xl
              pb-10 md:pb-0
            ">

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="
                  text-4xl
                  md:text-6xl
                  font-black
                  leading-tight
                "
              >
                {zapatoHero.modelo}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="
                  mt-6
                  text-lg
                  text-gray-300
                  max-w-lg
                "
              >
                Descubre modelos modernos con excelente
                comodidad y diseño.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="
                  mt-8
                  flex
                  items-center
                  gap-6
                "
              >

                <button
                  onClick={() =>
                    navigate(`/zapato/${zapatoHero.id}`)
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    px-7
                    py-3.5
                    rounded-2xl
                    font-semibold
                    shadow-2xl
                    transition-all
                    hover:scale-105
                  "
                >
                  Ver producto
                </button>

                <span className="
                  text-4xl
                  font-black
                ">
                  ${zapatoHero.precio}
                </span>
              </motion.div>
            </div>

            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="
                relative
                flex
                items-center
                justify-center
                w-full
                md:w-1/2
                h-full
              "
            >

              {/* glow */}
              <div className="
                absolute
                w-[500px]
                h-[500px]
                bg-blue-500/20
                rounded-full
                blur-3xl
              " />

              {/* contenedor fijo */}
              <div
                className="
                  relative
                  z-10
                  w-full
                  h-[320px] sm:h-[420px] md:h-[500px]
                  flex
                  items-center
                  justify-center
                "
              >
                <img
                  src={zapatoHero.foto}
                  alt={zapatoHero.modelo}
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                    drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]
                    sm:hover:scale-105
                    rotate-0 sm:rotate-[-6deg]
                    transition-all
                    duration-700
                  "
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* CATÁLOGO */}
      <div className="px-6 md:px-16 py-16">

        {/* header */}
        <div className="
          flex flex-col
          lg:flex-row
          lg:items-end
          lg:justify-between
          gap-6
          mb-12
        ">

          {/* textos */}
          <div>
            <h2 className="
              text-4xl
              md:text-5xl
              font-black
              text-gray-900
            ">
              Catálogo
            </h2>

            <p className="
              text-gray-500
              mt-3
              text-lg
            ">
              Explora nuestra colección disponible.
            </p>
          </div>

          {/* filtros */}
          <div className="
            flex flex-col
            sm:flex-row
            gap-4
          ">

            <select
              onChange={(e) =>
                setFiltroModelo(e.target.value)
              }
              className="
                bg-white
                border border-gray-200
                shadow-sm
                rounded-2xl
                px-5 py-3
                min-w-[220px]
                focus:ring-2
                focus:ring-blue-500
                outline-none
                transition
              "
            >
              <option value="">
                Todos los modelos
              </option>

              {modelos.map((modelo, i) => (
                <option key={i} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setFiltroTalla(e.target.value)
              }
              className="
                bg-white
                border border-gray-200
                shadow-sm
                rounded-2xl
                px-5 py-3
                min-w-[180px]
                focus:ring-2
                focus:ring-blue-500
                outline-none
                transition
              "
            >
              <option value="">
                Todas las tallas
              </option>

              {tallas.map((talla, i) => (
                <option key={i} value={talla}>
                  {talla}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID */}
        <motion.div
          layout
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-8
          "
        >
          {zapatosFiltrados.map((zapato, index) => (
            <motion.div
              key={zapato.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05
              }}
            >
              <ZapatoCard
                zapato={zapato}
                tallas={tallasMap[zapato.id] || []}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="
        border-t
        border-gray-200
        py-8
        text-center
        text-gray-500
        text-sm
        bg-white
      ">
        JimTell © 2025
      </footer>
    </div>
  )
}

export default Home