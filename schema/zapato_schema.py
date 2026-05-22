#Se encarga de validar los datos de entrada para el trabajador
from pydantic import BaseModel
from model.estado import estado

class ZapatoCreate(BaseModel):
    modelo: str
    talla: int
    precio: float
    foto: str | None = None
    estado: estado

class ZapatoResponse(BaseModel):
    modelo: str
    talla: int
    precio: float
    foto: str | None = None
    estado: estado
    
    class Config:
        from_attributes = True
