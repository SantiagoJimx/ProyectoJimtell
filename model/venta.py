from sqlalchemy import Column, Integer, Date, ForeignKey
from database import Base

class venta(Base): 
    __tablename__ = "venta"
    id = Column(Integer, primary_key=True)
    fecha_venta = Column(Date, nullable=False)
    zapato_id = Column(Integer, ForeignKey("zapato.id"), nullable=False)
