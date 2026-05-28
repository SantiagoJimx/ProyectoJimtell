from sqlalchemy.orm import Session
from model.venta import venta
from schema.venta_schema import VentaCreate

def crear_venta(db: Session, venta_dato: VentaCreate):
    nueva_venta = venta(
        fecha_venta=venta_dato.fecha_venta,
        modelo=venta_dato.modelo,
        numero_talla=venta_dato.numero_talla,
        precio=venta_dato.precio,
        foto=venta_dato.foto,
        talla_id=venta_dato.talla_id
    )
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta

def obtener_ventas(db: Session):
    return db.query(venta).all()