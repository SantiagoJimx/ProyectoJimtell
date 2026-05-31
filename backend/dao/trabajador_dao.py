from sqlalchemy.orm import Session
from model.trabajador import Trabajador
from schema.trabajador_schema import TrabajadorCreate
from util.security import hash_password


#Crear trabajador 
def crear_trabajador(db: Session, trabajador: TrabajadorCreate):
    nuevo_trabajador = Trabajador(
        usuario=trabajador.usuario,
        password=hash_password(trabajador.password),
        rol=trabajador.rol
    )
    #agrega el objeto a la sesión de la base de datos, 
    db.add(nuevo_trabajador)
    db.commit() #confrima y guarda en la BD
    db.refresh(nuevo_trabajador)#actualiza el objeto con los datos de la base de datos, como el id generado automaticamente
    return nuevo_trabajador

#consultas para obtener a los trabajadores
def obtener_trabajador_por_usuario(db: Session, usuario: str):
    return db.query(Trabajador).filter(Trabajador.usuario == usuario).first() #consulta la base de datos para obtener el trabajador con el usuario especificado, devuelve el primer resultado encontrado o None si no se encuentra ningun trabajador con ese usuario

def obtener_trabajadores(db: Session):
    return db.query(Trabajador).all() #consulta la base de datos para obtener todos los trabajadores, devuelve una lista con todos los trabajadores encontrados

#Editar al trabajador
def editar_trabajador(db: Session, usuario: str, trabajador: TrabajadorCreate):
    trabajador_db = db.query(Trabajador).filter(Trabajador.usuario == usuario).first() #consulta la base de datos para obtener el trabajador con el usuario especificado, devuelve el primer resultado encontrado o None si no se encuentra ningun trabajador con ese usuario
    if trabajador_db:
        trabajador_db.usuario = trabajador.usuario
        trabajador_db.password = trabajador.password
        trabajador_db.rol = trabajador.rol
        trabajador_db.correo_electronico = trabajador.correo_electronico
        db.commit() #confrima y guarda en la BD
        db.refresh(trabajador_db) #actualiza el objeto con los datos de la base de datos, como el id generado automaticamente
    return trabajador_db

#Eliminar al trabajador
def eliminar_trabajador(db: Session, usuario: str):
    trabajador_db = db.query(Trabajador).filter(Trabajador.usuario == usuario).first() #consulta la base de datos para obtener el trabajador con el usuario especificado, devuelve el primer resultado encontrado o None si no se encuentra ningun trabajador con ese usuario
    if trabajador_db:
        db.delete(trabajador_db) #elimina el objeto de la sesión de la base de datos
        db.commit() #confrima y guarda en la BD
    return trabajador_db

