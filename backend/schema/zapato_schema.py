from pydantic import BaseModel, model_validator
from model.estado import estado
from util.security import codificar_id

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
    codigo: str = ""

    class Config:
        from_attributes = True

    @model_validator(mode='after')
    def set_codigo(self):
        self.codigo = codificar_id(self.id)
        return self
