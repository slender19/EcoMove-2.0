from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from typing import List
from sqlalchemy.orm import Session
from backend import schemas, crud
from backend.database import get_db
import os
import shutil

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

# 📂 Carpeta donde se guardan las imágenes
UPLOAD_DIR = "static/vehicles"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ======================== CRUD PRINCIPAL ========================

@router.post("/", response_model=schemas.VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle: schemas.VehicleCreate, db: Session = Depends(get_db)):
    """Crea un vehículo (sin imagen por ahora)."""
    return crud.create_vehicle(db, vehicle)


@router.get("/", response_model=List[schemas.VehicleOut])
def list_vehicles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_vehicles(db, skip=skip, limit=limit)


@router.get("/{vehicle_id}", response_model=schemas.VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = crud.get_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle


@router.put("/{vehicle_id}", response_model=schemas.VehicleOut)
def update_vehicle(vehicle_id: int, vehicle: schemas.VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = crud.update_vehicle(db, vehicle_id, vehicle)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

@router.patch("/{vehicle_id}", response_model=schemas.VehicleOut)
def patch_vehicle(vehicle_id: int, updates: dict, db: Session = Depends(get_db)):
    db_vehicle = crud.get_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Solo actualiza los campos enviados
    for key, value in updates.items():
        if hasattr(db_vehicle, key):
            setattr(db_vehicle, key, value)

    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.delete("/{vehicle_id}", response_model=schemas.VehicleOut)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    db_vehicle = crud.delete_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle


# ======================== SUBIR IMAGEN ========================

@router.post("/{vehicle_id}/upload-image")
def upload_vehicle_image(
    vehicle_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    request: Request = None
):
    """Sube una imagen y actualiza el campo `imagen` en la base de datos."""
    db_vehicle = crud.get_vehicle(db, vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Guardar archivo físico
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"vehiculo_{vehicle_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Construir URL pública
    base_url = str(request.base_url).rstrip("/") if request else ""
    image_url = f"{base_url}/static/vehicles/{file_name}" if base_url else f"/static/vehicles/{file_name}"

    # Actualizar campo imagen
    db_vehicle.imagen = f"/static/vehicles/{file_name}"
    db.commit()
    db.refresh(db_vehicle)

    return {
        "message": "Imagen subida correctamente",
        "url": image_url,
        "vehicle": db_vehicle
    }
