from sqlalchemy.orm import Session
from model.venta import venta
from schema.venta_schema import VentaCreate


#Crear una nueva venta en la base de datos
def crear_venta(db: Session, venta_dato: VentaCreate):
    nueva_venta = venta(
        fecha_venta=venta_dato.fecha_venta,
        zapato_id=venta_dato.zapato_id
    )
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta

#Mostrar todas las ventas 
def obtener_ventas(db: Session):
    return db.query(venta).all()