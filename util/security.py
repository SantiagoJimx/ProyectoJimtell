#Se utilizara para cifrar contraseñas y generar tokens de autenticación
from passlib.context import CryptContext 
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "JimtellSecretKey")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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