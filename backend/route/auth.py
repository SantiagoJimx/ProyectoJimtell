from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from dao import trabajador_dao
from util.security import verify_password, crear_token

router = APIRouter()

#ruta para iniciar sesión
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #busca al trabajador por su usuario si no lo encuentra lanza una excepción
    trabajador = trabajador_dao.obtener_trabajador_por_usuario(db, form_data.username)
    if not trabajador or not verify_password(form_data.password, trabajador.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    # 3. Generar el token con el usuario y rol
    token = crear_token({"sub": trabajador.usuario, "rol": trabajador.rol.value})
    
    return {"access_token": token, "token_type": "bearer"}