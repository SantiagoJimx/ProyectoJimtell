import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Inventario from './pages/Inventario'
import Ventas from './pages/Ventas'
import Trabajadores from './pages/Trabajadores'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App