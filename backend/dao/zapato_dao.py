from sqlalchemy.orm import Session
from model.trabajador import Trabajador
from model.zapato import zapato
from schema.zapato_schema import ZapatoCreate
from model.talla import Talla
from model.estado import estado

#Crear un nuevo zapato en la base de datos
def crear_zapato(db: Session, zapato_dato: ZapatoCreate, usuario: str):
    trabajador = db.query(Trabajador).filter(Trabajador.usuario == usuario).first()
    nuevo_zapato = zapato(
        modelo=zapato_dato.modelo,
        precio=zapato_dato.precio,
        foto=zapato_dato.foto,
        trabajador_id=trabajador.id
    )
    db.add(nuevo_zapato)
    db.flush()
    return nuevo_zapato

#Obtener un zapato por su modelo
def obtener_zapato_por_modelo(db: Session, modelo: str):
    return db.query(zapato).filter(zapato.modelo == modelo).all()

#Obtener todos los zapatos
def obtener_zapatos(db: Session):
    return db.query(zapato).all()

#Editar un zapato
def editar_zapato(db: Session, id: int, zapato_dato: ZapatoCreate, usuario: str):
    trabajador = db.query(Trabajador).filter(Trabajador.usuario == usuario).first()
    if trabajador.rol.value == "Administrador":
        zapato_db = db.query(zapato).filter(zapato.id == id).first()
    else:
        zapato_db = db.query(zapato).filter(zapato.id == id, zapato.trabajador_id == trabajador.id).first()
    
    if zapato_db:
        zapato_db.modelo = zapato_dato.modelo
        zapato_db.precio = zapato_dato.precio
        zapato_db.foto = zapato_dato.foto
    return zapato_db

#obtener Zapato por su talla
def obtener_zapatos_por_talla(db: Session, numero: int):
    return db.query(zapato).join(Talla).filter(
        Talla.numero == numero,
        Talla.estado == estado.DISPONIBLE
    ).all()
    
#obtener Zapato por su id
def obtener_zapato_por_id(db: Session, id: int):
    return db.query(zapato).filter(zapato.id == id).first()