from sqlalchemy.orm import Session
from model.talla import Talla
from model.zapato import zapato
from model.estado import estado
from datetime import date

def crear_tallas(db: Session, zapato_id: int, numeros: list[int]):
    for numero in numeros:
        talla = Talla(
            numero=numero,
            estado=estado.DISPONIBLE,
            zapato_id=zapato_id
        )
        db.add(talla)

def obtener_tallas_por_zapato(db: Session, zapato_id: int):
    return db.query(Talla).filter(Talla.zapato_id == zapato_id).all()

def marcar_talla_vendida(db: Session, talla_id: int):
    from dao.venta_dao import crear_venta
    from schema.venta_schema import VentaCreate
    
    talla = db.query(Talla).filter(Talla.id == talla_id).first()
    if talla:
        zapato_db = db.query(zapato).filter(zapato.id == talla.zapato_id).first()
        talla.estado = estado.VENDIDO
        db.commit()
        db.refresh(talla)
        
        venta_dato = VentaCreate(
            fecha_venta=date.today(),
            modelo=zapato_db.modelo,
            numero_talla=talla.numero,
            precio=zapato_db.precio,
            foto=zapato_db.foto,
            talla_id=talla_id
        )
        crear_venta(db, venta_dato)
    return talla

def eliminar_tallas_por_zapato(db: Session, zapato_id: int):
    db.query(Talla).filter(Talla.zapato_id == zapato_id).delete()
    db.commit()

def crear_talla(db: Session, zapato_id: int, numero: int):
    talla = Talla(
        numero=numero,
        estado=estado.DISPONIBLE,
        zapato_id=zapato_id
    )
    db.add(talla)
    db.commit()
    db.refresh(talla)
    return talla

#eliminar talla 
def eliminar_talla(db: Session, talla_id: int):
    talla = db.query(Talla).filter(Talla.id == talla_id).first()
    if talla:
        db.delete(talla)
        db.commit()
    return talla