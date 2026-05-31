from pydantic import BaseModel

class ConfiguracionUpdate(BaseModel):
    whatsapp: str

class ConfiguracionResponse(BaseModel):
    id: int
    whatsapp: str
    
    class Config:
        from_attributes = True