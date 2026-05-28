from sqlalchemy import Column, Integer, Date, ForeignKey, String, Float, Date, ForeignKey
from database import Base

class venta(Base): 
    __tablename__ = "venta"
    id = Column(Integer, primary_key=True)
    fecha_venta = Column(Date, nullable=False)
    modelo = Column(String, nullable=False)
    numero_talla = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    foto = Column(String, nullable=True)
    talla_id = Column(Integer, ForeignKey("talla.id", ondelete="SET NULL"), nullable=True)
