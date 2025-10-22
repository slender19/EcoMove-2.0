from pydantic import BaseModel, EmailStr 
from typing import Optional

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

class VehicleCreate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: int
    class Config:
        orm_mode = True
