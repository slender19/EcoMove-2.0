from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship 
from backend.database import Base  

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

    station_id = Column(Integer, ForeignKey("stations.id"), nullable=True)
    station = relationship("Station", back_populates="vehicles")
