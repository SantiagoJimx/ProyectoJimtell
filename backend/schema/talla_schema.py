from pydantic import BaseModel
from model.estado import estado

class TallaCreate(BaseModel):
    numero: int
    zapato_id: int
    
class TallaResponse(BaseModel):
    id: int
    numero: int
    estado: estado
    zapato_id: int
    
    class Config:
        from_attributes = True