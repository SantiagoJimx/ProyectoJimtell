from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dao import zapato_dao
from database import get_db
from schema.zapato_schema import ZapatoCreate, ZapatoResponse
from util.security import get_current_user

router = APIRouter()

#crear los zapatos
@router.post("/zapatos", response_model=ZapatoResponse)
def create_zapato(zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return zapato_dao.create_zapato(db, zapato, current_user["sub"])

#editar un zapato por su modelo
@router.put("/zapatos/{id}", response_model=ZapatoResponse)
def editar_zapato(id: int, zapato: ZapatoCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return zapato_dao.editar_zapato(db, id, zapato, current_user["sub"])

#eliminar un zapato por su modelo
@router.delete("/zapatos/{id}", response_model=ZapatoResponse)
def eliminar_zapato(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return zapato_dao.eliminar_zapato(db, id, current_user["sub"])

#marcar un zapato como vendido
@router.put("/zapatos/{id}/vender", response_model=ZapatoResponse)
def marcar_zapato_como_vendido(id: int, db: Session = Depends(get_db)):
    return zapato_dao.marcar_zapato_como_vendido(db, id)


#obtener todos los zapatos 
@router.get("/zapatos", response_model=list[ZapatoResponse])
def get_zapatos(db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapatos(db)

#obtener un zapato por su modelo
@router.get("/zapatos/modelo/{modelo}", response_model=list[ZapatoResponse])
def get_zapato_by_modelo(modelo: str, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapato_por_modelo(db, modelo)

#obtener un zapato por su talla
@router.get("/zapatos/talla/{talla}", response_model=list[ZapatoResponse])
def get_zapato_by_talla(talla: int, db: Session = Depends(get_db)):
    return zapato_dao.obtener_zapato_por_talla(db, talla)