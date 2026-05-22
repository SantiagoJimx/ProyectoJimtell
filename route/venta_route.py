from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dao import venta_dao
from database import get_db
from schema.venta_schema import VentaCreate, VentaResponse

router = APIRouter()

#crear una venta
@router.post("/ventas", response_model=VentaResponse)
def crear_venta(venta: VentaCreate, db: Session = Depends(get_db)):
    return venta_dao.crear_venta(db, venta)

#obtener todas las ventas
@router.get("/ventas", response_model=list[VentaResponse])
def get_ventas(db: Session = Depends(get_db)):
    return venta_dao.obtener_ventas(db)