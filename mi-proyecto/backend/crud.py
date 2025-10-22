from sqlalchemy.orm import Session
from passlib.context import CryptContext
from backend import models, schemas


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# PASSWORD HELPERS
# ============================

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)



#  USERS
# ============================

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_cedula(db: Session, cedula: str):
    return db.query(models.User).filter(models.User.cedula == cedula).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        cedula=user.cedula,
        email=user.email,
        password=hashed,
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db_user.name = user.name
    db_user.cedula = user.cedula
    db_user.email = user.email
    db_user.password = get_password_hash(user.password)
    db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user



# STATIONS
# ============================

def create_station(db: Session, station: schemas.StationCreate):
    db_station = models.Station(
        name=station.name,
        location=station.location,
        status=station.status
    )
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station

def get_station(db: Session, station_id: int):
    return db.query(models.Station).filter(models.Station.id == station_id).first()

def get_stations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Station).offset(skip).limit(limit).all()

def update_station(db: Session, station_id: int, station: schemas.StationCreate):
    db_station = get_station(db, station_id)
    if not db_station:
        return None
    db_station.name = station.name
    db_station.location = station.location
    db_station.status = station.status
    db.commit()
    db.refresh(db_station)
    return db_station

def delete_station(db: Session, station_id: int):
    db_station = get_station(db, station_id)
    if not db_station:
        return None
    db.delete(db_station)
    db.commit()
    return db_station



# VEHICLES
# ============================

def create_vehicle(db: Session, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Vehicle(
        type=vehicle.type,
        marca=vehicle.marca,
        modelo=vehicle.modelo,
        tarifa=vehicle.tarifa,
        status=vehicle.status,
        station_id=vehicle.station_id
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_vehicle(db: Session, vehicle_id: int):
    return db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()

def get_vehicles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vehicle).offset(skip).limit(limit).all()

def update_vehicle(db: Session, vehicle_id: int, vehicle: schemas.VehicleCreate):
    db_vehicle = get_vehicle(db, vehicle_id)
    if not db_vehicle:
        return None
    db_vehicle.type = vehicle.type
    db_vehicle.marca = vehicle.marca
    db_vehicle.modelo = vehicle.modelo
    db_vehicle.tarifa = vehicle.tarifa
    db_vehicle.status = vehicle.status
    db_vehicle.station_id = vehicle.station_id
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def delete_vehicle(db: Session, vehicle_id: int):
    db_vehicle = get_vehicle(db, vehicle_id)
    if not db_vehicle:
        return None
    db.delete(db_vehicle)
    db.commit()
    return db_vehicle
