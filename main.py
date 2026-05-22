from fastapi import FastAPI
from database import Base, engine
from route import zapato_route, trabajador_route, venta_route, auth

# Crea las tablas en la base de datos automáticamente
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrar las rutas
app.include_router(auth.router, tags=["Auth"])
app.include_router(zapato_route.router, tags=["Zapatos"])
app.include_router(trabajador_route.router, tags=["Trabajadores"])
app.include_router(venta_route.router, tags=["Ventas"])