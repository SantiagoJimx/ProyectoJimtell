# Página Jimtell

Sistema web de gestión de inventario de calzado para la empresa **Jimtell**. Permite administrar productos, tallas, ventas y vendedores, con una tienda pública donde los clientes pueden explorar el catálogo y contactar al administrador por WhatsApp.

---

## Tecnologías

**Backend**
- Python + FastAPI
- SQLAlchemy (ORM)
- PostgreSQL
- JWT (autenticación)
- Cloudinary (almacenamiento de imágenes)

**Frontend**
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion

---

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| **Administrador** | CRUD completo de zapatos, gestión de vendedores, historial de ventas, configuración de WhatsApp |
| **Vendedor** | Ver inventario, marcar tallas como vendidas |
| **Cliente** | Ver catálogo público, filtrar por modelo y talla, contactar por WhatsApp |

---

## Funcionalidades

- Catálogo público con filtros por modelo y talla
- Gestión de inventario con múltiples tallas y cantidades por modelo
- Registro de ventas por talla individual
- Historial de ventas con foto, modelo, talla, precio y fecha
- Gestión de vendedores (crear, editar, eliminar)
- Botón de contacto directo por WhatsApp con mensaje predefinido
- Autenticación con JWT y protección de rutas por rol
- Diseño responsivo para móvil, tablet y escritorio
- Configuración del número de WhatsApp desde el panel admin

---

## Estructura del proyecto
ProyectoJimtell/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── model/
│   ├── schema/
│   ├── route/
│   ├── dao/
│   └── util/
└── frontend/
└── src/
├── pages/
├── components/
└── services/

---

## Instalación local

### Requisitos
- Python 3.12+
- Node.js 22+
- PostgreSQL 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Crea un archivo `.env` en la carpeta `backend/`:
SECRET_KEY=tu_clave_secreta

Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE zapatos_db;
```

Inicia el servidor:
```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Variables de entorno

**Backend `.env`**
SECRET_KEY=tu_clave_secreta

**Frontend `.env`**
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=zapatos_preset

---

## Capturas de pantalla

Proximamente

---

## Autor

**Santiago Jiménez**  
[GitHub](https://github.com/SantiagoJimx)

---

## Licencia

Este proyecto es de uso privado para la empresa Jimtell.