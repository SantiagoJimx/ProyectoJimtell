import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Inventario from './pages/Inventario'
import Ventas from './pages/Ventas'
import Trabajadores from './pages/Trabajadores'
import ZapatoDetalle from './pages/ZapatoDetalle'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/zapato/:codigo" element={<ZapatoDetalle />} />
        <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
        <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
        <Route path="/trabajadores" element={<ProtectedRoute><Trabajadores /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App