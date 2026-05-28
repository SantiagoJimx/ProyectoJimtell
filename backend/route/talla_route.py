from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dao import talla_dao, zapato_dao
from schema.talla_schema import TallaResponse, TallaCreate
from util.security import get_current_user

router = APIRouter()

#Obtener tallas por zapato
@router.get("/zapatos/{zapato_id}/tallas", response_model=list[TallaResponse])
def get_tallas(zapato_id: int, db: Session = Depends(get_db)):
    return talla_dao.obtener_tallas_por_zapato(db, zapato_id)

#Marcar talla como vendida
@router.put("/tallas/{talla_id}/vender", response_model=TallaResponse)
def vender_talla(talla_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return talla_dao.marcar_talla_vendida(db, talla_id)


@router.post("/tallas", response_model=TallaResponse)
def agregar_talla(talla: TallaCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return talla_dao.crear_talla(db, talla.zapato_id, talla.numero)

#eliminar talla
@router.delete("/tallas/{talla_id}")
def eliminar_talla(talla_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return talla_dao.eliminar_talla(db, talla_id)