from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dao import talla_dao, zapato_dao
from database import get_db
from schema.zapato_schema import ZapatoCreate, ZapatoResponse
from util.security import get_current_user, decodificar_id

router = APIRouter()

def verificar_admin(current_user: dict):
    if current_user.get("rol") != "Administrador":
        raise HTTPException(status_code=403, detail="Solo el administrador puede realizar esta acción")

@router.post("/zapatos", response_model=ZapatoResponse)
def create_zapato(zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    try:
        nuevo_zapato = zapato_dao.crear_zapato(db, zapato, current_user["sub"])
        if zapato.tallas:
            talla_dao.crear_tallas(db, nuevo_zapato.id, zapato.tallas)
        db.commit()
        db.refresh(nuevo_zapato)
        return nuevo_zapato
    except:
        db.rollback()
        raise

@router.put("/zapatos/{id}", response_model=ZapatoResponse)
def editar_zapato(id: int, zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verificar_admin(current_user)
    try:
        zapato_actualizado = zapato_dao.editar_zapato(db, id, zapato, current_user["sub"])
        if zapato.tallas:
            talla_dao.crear_tallas(db, id, zapato.tallas)
        db.commit()
        db.refresh(zapato_actualizado)
        return zapato_actualizado
    except:
        db.rollback()
        raise

@router.get("/zapatos", response_model=list[ZapatoResponse])
def get_zapatos(db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapatos(db)

@router.get("/zapatos/modelo/{modelo}", response_model=list[ZapatoResponse])
def get_zapato_by_modelo(modelo: str, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapato_por_modelo(db, modelo)

@router.get("/zapatos/talla/{talla}", response_model=list[ZapatoResponse])
def get_zapato_by_talla(talla: int, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapatos_por_talla(db, talla)

@router.get("/zapatos/codigo/{codigo}", response_model=ZapatoResponse)
def get_zapato_by_codigo(codigo: str, db: Session = Depends(get_db)):
    id = decodificar_id(codigo)
    if id is None:
        try:
            id = int(codigo)
        except ValueError:
            raise HTTPException(status_code=404, detail="Zapato no encontrado")
    zapato = zapato_dao.obtener_zapato_por_id(db, id)
    if not zapato:
        raise HTTPException(status_code=404, detail="Zapato no encontrado")
    return zapato

@router.get("/zapatos/{id}", response_model=ZapatoResponse)
def get_zapato(id: int, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapato_por_id(db, id)