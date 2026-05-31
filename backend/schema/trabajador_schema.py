#Se encarga de validar los datos de entrada para el trabajador
from pydantic import BaseModel, EmailStr
from model.rol import Rol

class Config:
    from_attributes = True

class TrabajadorCreate(BaseModel):
    usuario: str
    password: str
    rol: Rol
    
class TrabajadorResponse(BaseModel):
    usuario: str
    rol: Rol
    
    class Config:
        from_attributes = True