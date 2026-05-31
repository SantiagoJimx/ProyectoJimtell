from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dao import configuracion_dao
from schema.configuracion_schema import ConfiguracionUpdate, ConfiguracionResponse
from util.security import get_current_user

router = APIRouter()

@router.get("/configuracion", response_model=ConfiguracionResponse)
def get_configuracion(db: Session = Depends(get_db)):
    return configuracion_dao.obtener_configuracion(db)

@router.put("/configuracion", response_model=ConfiguracionResponse)
def update_configuracion(config: ConfiguracionUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return configuracion_dao.actualizar_whatsapp(db, config.whatsapp)