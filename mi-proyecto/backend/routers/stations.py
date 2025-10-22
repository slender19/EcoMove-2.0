from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from backend import schemas, crud
from backend.database import get_db

router = APIRouter(prefix="/stations", tags=["stations"])

@router.post("/", response_model=schemas.StationOut, status_code=status.HTTP_201_CREATED)
def create_station(station: schemas.StationCreate, db: Session = Depends(get_db)):
    return crud.create_station(db, station)

@router.get("/", response_model=List[schemas.StationOut])
def list_stations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stations(db, skip=skip, limit=limit)

@router.get("/{station_id}", response_model=schemas.StationOut)
def get_station(station_id: int, db: Session = Depends(get_db)):
    db_station = crud.get_station(db, station_id)
    if not db_station:
        raise HTTPException(status_code=404, detail="Station not found")
    return db_station

@router.put("/{station_id}", response_model=schemas.StationOut)
def update_station(station_id: int, station: schemas.StationCreate, db: Session = Depends(get_db)):
    db_station = crud.update_station(db, station_id, station)
    if not db_station:
        raise HTTPException(status_code=404, detail="Station not found")
    return db_station

@router.delete("/{station_id}", response_model=schemas.StationOut)
def delete_station(station_id: int, db: Session = Depends(get_db)):
    db_station = crud.delete_station(db, station_id)
    if not db_station:
        raise HTTPException(status_code=404, detail="Station not found")
    return db_station
