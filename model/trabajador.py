from model.rol import Rol
from typing import Optional

class Trabajador:
    def __init__(
        self, 
        id_trabajador: int,
        usuario: str, 
        password: str, 
        rol: Rol,
        correo_electronico: Optional[str] = None
    ):
        self.id_trabajador = id_trabajador
        self.usuario = usuario
        self.password = password
        self.rol = rol
        self.correo_electronico = correo_electronico

    def __str__(self):
        return f"Trabajador(id_trabajador={self.id_trabajador}, usuario='{self.usuario}', rol='{self.rol.value}', correo_electronico='{self.correo_electronico}')"