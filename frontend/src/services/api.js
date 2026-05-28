import axios from 'axios';

const api = axios.create({ //crea una instancia de axios con una configuración base
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use((config) => { //intercepta cada solicitud antes de ser enviada
  const token = localStorage.getItem('token') //obtiene el token de autenticacion al hacer login
  if (token) {
    config.headers.Authorization = `Bearer ${token}` //agrega el token al herader de inmediato
  }
  return config
})

export default api

export const subirImagen = async (archivo) => {
  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await response.json()
  return data.secure_url
}