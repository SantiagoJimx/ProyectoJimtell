import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/75
        backdrop-blur-xl
        border-b border-gray-200/50
      "
    >
      <div className="px-6 md:px-14 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div
            className="
              w-11 h-11
              rounded-2xl
              bg-blue-600
              flex items-center justify-center
              shadow-lg
            "
          >
            <span className="text-white font-black text-lg">
              J
            </span>
          </div>

          <div>
            <h1 className="text-xl font-black text-gray-800">
              JimTell
            </h1>

            <p className="text-xs text-gray-500">
              Catalogo
            </p>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={() => navigate('/login')}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5 py-2.5
            rounded-2xl
            font-semibold
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
          "
        >
          Admin Login
        </button>

      </div>
    </nav>
  )
}

export default Navbar