class venta: 
    def __init__(
        self, 
        id_venta: int, 
        fecha_venta: str,
        zapato_id: int
    ):
        self.id_venta = id_venta
        self.fecha_venta = fecha_venta
        self.zapato_id = zapato_id

    def __str__(self):
        return f"Venta(id_venta={self.id_venta}, fecha_venta='{self.fecha_venta}', zapato_id={self.zapato_id})"