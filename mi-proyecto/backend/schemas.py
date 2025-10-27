from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User
class UserBase(BaseModel):
    name: str
    cedula: str
    email: EmailStr
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True


# Station
class StationBase(BaseModel):
    name: str
    location: Optional[str] = None
    status: Optional[str] = "operativo"

class StationCreate(StationBase):
    pass

class StationOut(StationBase):
    id: int
    class Config:
        orm_mode = True


# Vehicle
class VehicleBase(BaseModel):
    type: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    tarifa: Optional[int] = None
    station_id: Optional[int] = None
    status: Optional[str] = "disponible"
    imagen: Optional[str] = None  

class VehicleCreate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: int
    class Config:
        orm_mode = True


# Prestamos
class PrestamoBase(BaseModel):
    estacion_origen: str
    estacion_destino: str
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    usuario: int
    vehiculo: int
    estado: Optional[str] = "activo"

class PrestamoCreate(PrestamoBase):
    pass

class PrestamoOut(BaseModel):
    id: int
    estacion_origen: str
    estacion_destino: str
    fecha_hora_inicio: datetime
    fecha_hora_fin: Optional[datetime]
    duracion: Optional[float]
    costo_calculado: Optional[float]
    estado: str
    vehiculo: int
    vehicle: Optional[VehicleOut]

    class Config:
        orm_mode = True


# Factura
class FacturaBase(BaseModel):
    monto: float
    metodo: Optional[str] = "efectivo"
    estado_pago: Optional[str] = "pendiente"
    prestamo: int

class FacturaCreate(FacturaBase):
    pass

class FacturaOut(FacturaBase):
    id_pago: int
    class Config:
        orm_mode = True
