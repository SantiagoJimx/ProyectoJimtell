import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import api from '../services/api'

import { Eye, EyeOff } from 'lucide-react'
import { GiRunningShoe } from 'react-icons/gi'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams()

      params.append('username', usuario)
      params.append('password', password)

      const response = await api.post('/login', params)

      localStorage.setItem(
        'token',
        response.data.access_token
      )

      navigate('/inventario')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])


  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-gradient-to-br
        from-gray-900
        via-gray-800
        to-black
        flex
        items-center
        justify-center
        px-6
      "
    >

      {/* glow */}
      <div className="
        absolute
        top-[-100px]
        right-[-100px]
        w-[400px]
        h-[400px]
        bg-blue-600/20
        rounded-full
        blur-3xl
      " />

      <div className="
        absolute
        bottom-[-120px]
        left-[-120px]
        w-[350px]
        h-[350px]
        bg-blue-400/10
        rounded-full
        blur-3xl
      " />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative
          z-10
          w-full
          max-w-5xl
          grid
          md:grid-cols-2
          overflow-hidden
          rounded-[40px]
          border
          border-white/10
          backdrop-blur-xl
          bg-white/5
          shadow-2xl
        "
      >

        {/* LEFT */}
        <div
          className="
            p-10 md:p-14
            bg-white
          "
        >

          {/* top */}
          <div className="mb-10">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-blue-600
              flex
              items-center
              justify-center
              shadow-lg
              mb-6
            ">
              <GiRunningShoe
                size={28}
                className="text-white"
              />
            </div>

            <h1 className="
              text-4xl
              font-black
              text-gray-900
            ">
              Bienvenido
            </h1>

            <p className="
              text-gray-500
              mt-3
              text-lg
            ">
              Inicia sesión para administrar
              el inventario.
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="
              mb-6
              bg-red-50
              border
              border-red-200
              text-red-500
              text-sm
              px-4
              py-3
              rounded-2xl
            ">
              {error}
            </div>
          )}

          {/* usuario */}
          <div className="mb-5">

            <label className="
              block
              text-sm
              font-semibold
              text-gray-700
              mb-2
            ">
              Usuario
            </label>

            <input
              type="text"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
              placeholder="Ingresa tu usuario"
              autoComplete="off"
              className="
                w-full
                bg-gray-100
                border
                border-transparent
                rounded-2xl
                px-5
                py-4
                outline-none
                focus:border-blue-500
                focus:bg-white
                transition-all
              "
            />
          </div>

          {/* password */}
          <div className="mb-8">

            <label className="
              block
              text-sm
              font-semibold
              text-gray-700
              mb-2
            ">
              Contraseña
            </label>

            <div className="relative">
              
            <input
              type={
                mostrarPassword
                  ? 'text'
                  : 'password'
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              autoComplete="new-password"
              style={{
                WebkitTextSecurity: mostrarPassword
                  ? 'none'
                  : 'disc'
              }}
              className="
                w-full
                bg-gray-100
                border
                border-transparent
                rounded-2xl
                px-5
                py-4
                pr-14
                outline-none
                focus:border-blue-500
                focus:bg-white
                transition-all
                [&::-ms-reveal]:hidden
                [&::-webkit-credentials-auto-fill-button]:hidden
              "
            />

              <button
                type="button"
                onClick={() =>
                  setMostrarPassword(
                    !mostrarPassword
                  )
                }
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-blue-600
                  transition
                "
              >
                {mostrarPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* botón */}
          <button
            onClick={handleLogin}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              py-4
              rounded-2xl
              shadow-xl
              transition-all
              hover:scale-[1.01]
            "
          >
            Iniciar Sesión
          </button>

          {/* volver */}
          <button
            onClick={() => navigate('/')}
            className="
              mt-6
              text-gray-500
              hover:text-blue-600
              text-sm
              transition
            "
          >
            ← Volver al catálogo
          </button>
        </div>

        {/* RIGHT */}
        <div
          className="
            hidden
            md:flex
            relative
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-blue-600
            to-blue-800
          "
        >

          {/* círculos */}
          <div className="
            absolute
            w-[350px]
            h-[350px]
            bg-white/10
            rounded-full
            blur-2xl
          " />

          <div className="
            absolute
            top-10
            right-10
            w-24
            h-24
            border
            border-white/20
            rounded-full
          " />

          <div className="
            absolute
            bottom-10
            left-10
            w-40
            h-40
            border
            border-white/10
            rounded-full
          " />

          {/* contenido */}
          <div className="
            relative
            z-10
            text-center
            text-white
            px-10
          ">

            <GiRunningShoe
              size={120}
              className="
                mx-auto
                mb-8
                opacity-90
              "
            />

            <h2 className="
              text-4xl
              font-black
              leading-tight
            ">
              Gestión de Inventario
            </h2>

            <p className="
              mt-6
              text-blue-100
              text-lg
              leading-relaxed
            ">
              Administra productos, tallas
              y disponibilidad desde un
              solo lugar.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login