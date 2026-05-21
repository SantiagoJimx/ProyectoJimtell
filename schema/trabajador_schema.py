#Se encarga de validar los datos de entrada para el trabajador
from pydantic import BaseModel, EmailStr
from model.rol import Rol

class TrabajadorCreate(BaseModel):
    usuario: str
    password: str
    rol: Rol
    correo_electronico: EmailStr
    
class TrabajadorResponse(BaseModel):
    usuario: str
    rol: Rol
    correo_electronico: EmailStr
    
    class Config:
        orm_mode = True