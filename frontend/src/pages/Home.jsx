import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ZapatoCard from '../components/ZapatoCard'
import api from '../services/api'

function Home() {
  const [zapatos, setZapatos] = useState([])
  const [zapatoHero, setZapatoHero] = useState(null)
  const [filtroModelo, setFiltroModelo] = useState('')
  const [filtroTalla, setFiltroTalla] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchZapatos = async () => {
      const response = await api.get('/zapatos')
      const disponibles = response.data.filter(z => z.estado === 'Disponible')
      setZapatos(disponibles)
      // Zapato aleatorio para el hero
      const random = disponibles[Math.floor(Math.random() * disponibles.length)]
      setZapatoHero(random)
    }
    fetchZapatos()
  }, [])

  const zapatosFiltrados = zapatos.filter(z => {
    const porModelo = filtroModelo ? z.modelo === filtroModelo : true
    const porTalla = filtroTalla ? z.talla === parseInt(filtroTalla) : true
    return porModelo && porTalla
  })

  const modelos = [...new Set(zapatos.map(z => z.modelo))]
  const tallas = [...new Set(zapatos.map(z => z.talla))].sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onFiltroModelo={setFiltroModelo}
        onFiltroTalla={setFiltroTalla}
        modelos={modelos}
        tallas={tallas}
      />

      {/* Hero */}
      {zapatoHero && (
        <div
          className="relative h-96 bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => navigate(`/zapato/${zapatoHero.modelo}`)}
        >
          <img
            src={zapatoHero.foto}
            alt={zapatoHero.modelo}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute text-white text-center">
            <h2 className="text-4xl font-bold">{zapatoHero.modelo}</h2>
            <p className="text-lg mt-2">€{zapatoHero.precio}</p>
          </div>
        </div>
      )}

      {/* Catálogo */}
      <div className="px-8 py-10">
        <h2 className="text-2xl font-bold mb-2">Catálogo de Productos</h2>
        <p className="text-gray-400 text-sm mb-6">Modelos destacados para gestión logística y retail.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {zapatosFiltrados.map((zapato, i) => (
            <ZapatoCard key={i} zapato={zapato} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6 border-t">
        SoleAdmin © 2024 SoleAdmin Logistics. All rights reserved.
      </footer>
    </div>
  )
}

export default Home