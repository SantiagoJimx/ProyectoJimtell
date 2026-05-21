from model.rol import Rol
from sqlalchemy import Column, Integer, String, Enum
from database import Base


class Trabajador(Base):
    __tablename__ = "trabajador"
    id = Column(Integer, primary_key=True)
    usuario = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    rol = Column(Enum(Rol), nullable=False)
    correo_electronico = Column(String, unique=True, nullable=True)
