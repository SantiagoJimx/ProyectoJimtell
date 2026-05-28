from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dao import talla_dao, zapato_dao
from database import get_db
from schema.zapato_schema import ZapatoCreate, ZapatoResponse
from util.security import get_current_user

router = APIRouter()

@router.post("/zapatos", response_model=ZapatoResponse)
def create_zapato(zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    nuevo_zapato = zapato_dao.crear_zapato(db, zapato, current_user["sub"])
    if zapato.tallas:
        talla_dao.crear_tallas(db, nuevo_zapato.id, zapato.tallas)
    return nuevo_zapato

@router.put("/zapatos/{id}", response_model=ZapatoResponse)
def editar_zapato(id: int, zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return zapato_dao.editar_zapato(db, id, zapato, current_user["sub"])

@router.delete("/zapatos/{id}", response_model=ZapatoResponse)
def eliminar_zapato(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return zapato_dao.eliminar_zapato(db, id, current_user["sub"])

@router.get("/zapatos", response_model=list[ZapatoResponse])
def get_zapatos(db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapatos(db)

@router.get("/zapatos/modelo/{modelo}", response_model=list[ZapatoResponse])
def get_zapato_by_modelo(modelo: str, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapato_por_modelo(db, modelo)

@router.get("/zapatos/talla/{talla}", response_model=list[ZapatoResponse])
def get_zapato_by_talla(talla: int, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapatos_por_talla(db, talla)