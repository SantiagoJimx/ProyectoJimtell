#Se encarga de validar los datos de entrada para el trabajador
from datetime import date
from pydantic import BaseModel
from schema.zapato_schema import ZapatoResponse 

class VentaCreate(BaseModel):
    fecha_venta: date
    zapato_id: int
    
class VentaResponse(BaseModel):
    fecha_venta: date
    zapato: ZapatoResponse
    
    class Config:
        orm_mode = True
