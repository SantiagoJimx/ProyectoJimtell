from model.estado import estado
from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
from database import Base

class zapato(Base):
    __tablename__ = "zapato"
    id = Column(Integer, primary_key=True)
    modelo = Column(String, nullable=False)
    talla = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    foto = Column(String, nullable=True)
    estado = Column(Enum(estado), nullable=False)
    trabajador_id = Column(Integer, ForeignKey("trabajador.id"), nullable=False)

   