from passlib.context import CryptContext 
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from hashids import Hashids
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "JimtellSecretKey")
_hashids = Hashids(salt=SECRET_KEY, min_length=4)

def codificar_id(id: int) -> str:
    return _hashids.encode(id)

def decodificar_id(codigo: str) -> int | None:
    decoded = _hashids.decode(codigo)
    return decoded[0] if decoded else None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
#generar el token de autenticación
def crear_token(data: dict) -> str:
    datos = data.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    datos.update({"exp": expiracion})
    return jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)

#Cifrar contraseñas
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

#verificar contraseñas
def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

#verificar el token de autenticación
def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    
#dependencia para obtener el usuario autenticado
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload