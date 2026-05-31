from sqlalchemy import Column, Integer, String
from database import Base

class Configuracion(Base):
    __tablename__ = "configuracion"
    
    id = Column(Integer, primary_key=True)
    whatsapp = Column(String, nullable=False)