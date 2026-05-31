from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dao import trabajador_dao
from schema.trabajador_schema import TrabajadorCreate, TrabajadorResponse
from util.security import get_current_user

router = APIRouter()

def verificar_admin(current_user: dict):
    if current_user.get("rol") != "Administrador":
        raise HTTPException(status_code=403, detail="Solo el administrador puede realizar esta acción")

@router.post("/trabajadores", response_model=TrabajadorResponse)
def crear_trabajador(trabajador: TrabajadorCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    return trabajador_dao.crear_trabajador(db, trabajador)

@router.put("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def editar_trabajador(usuario: str, trabajador: TrabajadorCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    return trabajador_dao.editar_trabajador(db, usuario, trabajador)

@router.delete("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def eliminar_trabajador(usuario: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    return trabajador_dao.eliminar_trabajador(db, usuario)

@router.get("/trabajadores", response_model=list[TrabajadorResponse])
def get_trabajadores(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    return trabajador_dao.obtener_trabajadores(db)

@router.get("/trabajadores/{usuario}", response_model=TrabajadorResponse)
def get_trabajador_por_usuario(usuario: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    return trabajador_dao.obtener_trabajador_por_usuario(db, usuario)