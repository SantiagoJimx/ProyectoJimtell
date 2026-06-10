import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:S%40mael1243@localhost:5432/zapatos_db")

engine = create_engine(DATABASE_URL) #creamos la conexion a la base de datos usando la URL que definimos

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) #creamos una clase para manejar las sesiones de la base de datos, le decimos que no queremos que se hagan commit automaticos, que no queremos que se hagan flush(que se envien los cambios pendientes a la base de datos de manera automatica antes de ejecutar uan consulta) automaticos y que queremos que se conecte a la base de datos usando el engine que creamos

Base = declarative_base() #creamos una clase base para nuestros modelos de datos, esta clase es la que vamos a usar para crear nuestras tablas en la base de datos  

#esta funcion es para obtener una sesion de la base de datos, es como decirle a SQL Alchemy que quieres interactuar con la base de datos para hacer consultas, guardar o elimiar datos
def get_db(): 
    db = SessionLocal() #creamos una nueva sesion de la base de datos usando la clase que creamos
    try:
        yield db #usamos yield para devolver la sesion de la base de datos, esta pausa la funcion hasta que se termine de usar la sesion, esto es importante para que no se cierre la sesion antes de que se termine de usar
    finally:
        db.close() #cerramos la sesion de la base de datos cuando ya no la necesitemos, esto es importante para liberar recursos y evitar problemas de conexion a la base de datos