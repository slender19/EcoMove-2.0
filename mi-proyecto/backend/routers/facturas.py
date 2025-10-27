from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from backend import schemas, crud
from backend.database import get_db

router = APIRouter(prefix="/facturas", tags=["facturas"])


# Crear una factura (confirmar pago)
@router.post("/", response_model=schemas.FacturaOut, status_code=status.HTTP_201_CREATED)
def create_factura(factura: schemas.FacturaCreate, db: Session = Depends(get_db)):
    db_factura = crud.create_factura(db, factura)
    if not db_factura:
        raise HTTPException(status_code=400, detail="No se pudo crear la factura (préstamo inválido)")
    return db_factura


# Obtener una factura específica
@router.get("/{factura_id}", response_model=schemas.FacturaOut)
def get_factura(factura_id: int, db: Session = Depends(get_db)):
    db_factura = crud.get_factura(db, factura_id)
    if not db_factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura


# Listar todas las facturas
@router.get("/", response_model=List[schemas.FacturaOut])
def list_facturas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_facturas(db, skip=skip, limit=limit)


# Listar préstamos activos (para devolución)
@router.get("/prestamos/activos", response_model=List[schemas.PrestamoOut])
def list_prestamos_activos(db: Session = Depends(get_db)):
    prestamos = crud.get_prestamos_activos(db)
    if not prestamos:
        raise HTTPException(status_code=404, detail="No hay préstamos activos")
    return prestamos
