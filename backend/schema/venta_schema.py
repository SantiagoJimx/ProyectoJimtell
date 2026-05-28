from datetime import date
from pydantic import BaseModel

class VentaCreate(BaseModel):
    fecha_venta: date
    modelo: str
    numero_talla: int
    precio: float
    foto: str | None = None
    talla_id: int

class VentaResponse(BaseModel):
    id: int
    fecha_venta: date
    modelo: str
    numero_talla: int
    precio: float
    foto: str | None = None
    
    class Config:
        from_attributes = True