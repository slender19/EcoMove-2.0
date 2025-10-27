from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    cedula = Column(String(11), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(20), default="user")


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=True)
    status = Column(String(20), default="operativo")

    vehicles = relationship("Vehicle", back_populates="station")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    status = Column(String(20), default="disponible")
    marca = Column(String(100), nullable=True)
    modelo = Column(String(100), nullable=True)
    tarifa = Column(Integer, nullable=True)
    imagen = Column(String(255), nullable=True)

    station_id = Column(Integer, ForeignKey("stations.id"), nullable=True)
    station = relationship("Station", back_populates="vehicles")


class Prestamo(Base):
    __tablename__ = "prestamos"

    id = Column(Integer, primary_key=True, index=True)
    estacion_origen = Column(String(100), nullable=False)
    estacion_destino = Column(String(100), nullable=False)
    fecha_hora_inicio = Column(DateTime, default=datetime.utcnow)
    fecha_hora_fin = Column(DateTime, nullable=True)
    duracion = Column(Float, nullable=True)
    costo_calculado = Column(Float, nullable=True)
    estado = Column(String(20), default="activo") 

    usuario = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehiculo = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    user = relationship("User")
    vehicle = relationship("Vehicle")


class Factura(Base):
    __tablename__ = "facturas"

    id_pago = Column(Integer, primary_key=True, index=True)
    monto = Column(Float, nullable=False)
    metodo = Column(String(50), default="efectivo")
    estado_pago = Column(String(20), default="pendiente")

    prestamo = Column(Integer, ForeignKey("prestamos.id"), nullable=False)
    prestamo_rel = relationship("Prestamo", backref="factura")
