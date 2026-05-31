from sqlalchemy.orm import Session
from model.configuracion import Configuracion

def obtener_configuracion(db: Session):
    config = db.query(Configuracion).first()
    if not config:
        config = Configuracion(whatsapp='')
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

def actualizar_whatsapp(db: Session, whatsapp: str):
    config = db.query(Configuracion).first()
    if config:
        config.whatsapp = whatsapp
    else:
        config = Configuracion(whatsapp=whatsapp)
        db.add(config)
    db.commit()
    db.refresh(config)
    return config