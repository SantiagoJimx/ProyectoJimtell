from sqlalchemy.orm import Session
from model.trabajador import Trabajador
from model.zapato import zapato
from schema.zapato_schema import ZapatoCreate
from model.estado import estado

#Crear un nuevo zapato en la base de datos
def create_zapato(db: Session, zapato_dato: ZapatoCreate, usuario: str):
    trabajador = db.query(Trabajador).filter(Trabajador.usuario == usuario).first()
    nuevo_zapato = zapato(
        modelo=zapato_dato.modelo,
        talla=zapato_dato.talla,
        precio=zapato_dato.precio,
        foto=zapato_dato.foto,
        estado=zapato_dato.estado,
        trabajador_id=trabajador.id
    )
    db.add(nuevo_zapato)
    db.commit()
    db.refresh(nuevo_zapato)
    return nuevo_zapato

#Obtener un zapato por su modelo
def obtener_zapato_por_modelo(db: Session, modelo: str):
    return db.query(zapato).filter(zapato.modelo == modelo).all()

#Obtener por la talla
def obtener_zapato_por_talla(db: Session, talla: int):
    return db.query(zapato).filter(zapato.talla == talla).all()

#Obtener todos los zapatos
def obtener_zapatos(db: Session):
    return db.query(zapato).all() 

#Editar un zapato por su modelo
def editar_zapato(db: Session, id: int, zapato_dato: ZapatoCreate, usuario: str):
    trabajador = db.query(Trabajador).filter(Trabajador.usuario == usuario).first()
    if trabajador.rol.value == "Administrador":
        zapato_db = db.query(zapato).filter(zapato.id == id).first()
    else:
        zapato_db = db.query(zapato).filter(zapato.id == id, zapato.trabajador_id == trabajador.id).first()
    
    if zapato_db:
        zapato_db.modelo = zapato_dato.modelo
        zapato_db.talla = zapato_dato.talla
        zapato_db.precio = zapato_dato.precio
        zapato_db.foto = zapato_dato.foto
        zapato_db.estado = zapato_dato.estado
        db.commit()
        db.refresh(zapato_db)
    return zapato_db

#Eliminar un zapato por su modelo
def eliminar_zapato(db: Session, id: int, usuario: str):
    trabajador = db.query(Trabajador).filter(Trabajador.usuario == usuario).first()
    if trabajador.rol.value == "Administrador":
        zapato_db = db.query(zapato).filter(zapato.id == id).first()
    else:
        zapato_db = db.query(zapato).filter(zapato.id == id, zapato.trabajador_id == trabajador.id).first()
    if zapato_db:
        db.delete(zapato_db)
        db.commit()
    return zapato_db

#Marcar zapato como vendido
def marcar_zapato_como_vendido(db: Session, id: int):
    zapato_db = db.query(zapato).filter(zapato.id == id).first()
    if zapato_db:
        zapato_db.estado = estado.VENDIDO
        db.commit()
        db.refresh(zapato_db)
    return zapato_db