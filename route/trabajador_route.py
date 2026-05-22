from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dao import trabajador_dao
from database import get_db
from schema.trabajador_schema import TrabajadorCreate, TrabajadorResponse   

router = APIRouter()

#crear un trabajador
@router.post("/trabajadores", response_model=TrabajadorResponse)
def crear_trabajador(trabajador: TrabajadorCreate, db: Session = Depends(get_db)):
    return trabajador_dao.crear_trabajador(db, trabajador)

#editar al trabajador por su usuario
@router.put("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def editar_trabajador(usuario: str, trabajador: TrabajadorCreate, db: Session = Depends(get_db)):
    return trabajador_dao.editar_trabajador(db, usuario, trabajador)

#eliminar al trabajador por su usuario
@router.delete("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def eliminar_trabajador(usuario: str, db: Session = Depends(get_db)):
    return trabajador_dao.eliminar_trabajador(db, usuario)

#obtener todos los trabajadores
@router.get("/trabajadores", response_model=list[TrabajadorResponse])
def get_trabajadores(db: Session = Depends(get_db)):
    return trabajador_dao.obtener_trabajadores(db)

#obtener un trabajador por su usuario
@router.get("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def get_trabajador_por_usuario(usuario: str, db: Session = Depends(get_db)):
    return trabajador_dao.obtener_trabajador_por_usuario(db, usuario)
