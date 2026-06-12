#Se encarga de validar los datos de entrada para el trabajador
from pydantic import BaseModel
from model.estado import estado

class ZapatoCreate(BaseModel):
    modelo: str
    precio: float
    foto: str | None = None
    tallas: list[int] = []

class ZapatoResponse(BaseModel):
    id: int
    modelo: str
    precio: float
    foto: str | None = None
    
    class Config:
        from_attributes = True
