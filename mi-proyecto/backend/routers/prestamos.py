from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from backend import schemas, crud
from backend.database import get_db

router = APIRouter(prefix="/prestamos", tags=["prestamos"])

@router.post("/", response_model=schemas.PrestamoOut, status_code=status.HTTP_201_CREATED)
def create_prestamo(prestamo: schemas.PrestamoCreate, db: Session = Depends(get_db)):
    db_prestamo = crud.create_prestamo(db, prestamo)
    if not db_prestamo:
        raise HTTPException(status_code=400, detail="No se pudo crear el préstamo (vehículo o datos inválidos)")
    return db_prestamo


@router.get("/", response_model=List[schemas.PrestamoOut])
def list_prestamos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_prestamos(db, skip=skip, limit=limit)


@router.get("/{prestamo_id}", response_model=schemas.PrestamoOut)
def get_prestamo(prestamo_id: int, db: Session = Depends(get_db)):
    db_prestamo = crud.get_prestamo(db, prestamo_id)
    if not db_prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return db_prestamo


@router.get("/usuario/{usuario_id}", response_model=List[schemas.PrestamoOut])
def get_prestamos_by_usuario(usuario_id: int, db: Session = Depends(get_db)):
    prestamos = crud.get_prestamos_by_usuario(db, usuario_id)
    if not prestamos:
        raise HTTPException(status_code=404, detail="No se encontraron préstamos para este usuario")
    return prestamos


@router.put("/{prestamo_id}", response_model=schemas.PrestamoOut)
def update_prestamo(prestamo_id: int, prestamo: schemas.PrestamoCreate, db: Session = Depends(get_db)):
    db_prestamo = crud.update_prestamo(db, prestamo_id, prestamo)
    if not db_prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return db_prestamo


@router.delete("/{prestamo_id}", response_model=schemas.PrestamoOut)
def delete_prestamo(prestamo_id: int, db: Session = Depends(get_db)):
    db_prestamo = crud.delete_prestamo(db, prestamo_id)
    if not db_prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return db_prestamo
