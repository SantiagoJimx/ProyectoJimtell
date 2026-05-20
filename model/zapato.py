from model.estado import estado

class zapato:
    def __init__(
        self,
        id: int, 
        modelo: str, 
        talla: int, 
        precio: float,
        estado: estado
    ):
        self.id_zapato = id
        self.modelo = modelo
        self.talla = talla
        self.precio = precio
        self.estado = estado
        
    def __str__(self):
        return f"Zapato(id_zapato={self.id_zapato}, modelo='{self.modelo}', talla={self.talla}, precio={self.precio}, estado={self.estado})"