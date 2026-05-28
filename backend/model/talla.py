from sqlalchemy import Column, Integer, Enum, ForeignKey
from database import Base
from model.estado import estado

class Talla(Base):
    __tablename__ = "talla"
    
    id = Column(Integer, primary_key=True)
    numero = Column(Integer, nullable=False)
    estado = Column(Enum(estado), nullable=False, default=estado.DISPONIBLE)
    zapato_id = Column(Integer, ForeignKey("zapato.id"), nullable=False)