from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import stations, prestamos, vehicles, users, facturas
from fastapi.staticfiles import StaticFiles
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoMove API (FastAPI + SQLite)")

os.makedirs("static/vehicles", exist_ok=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(stations.router)
app.include_router(vehicles.router)
app.include_router(users.router)
app.include_router(prestamos.router)
app.include_router(facturas.router)

@app.get("/")
def read_root():
    return {"message": "API con FastAPI + SQLite funcionando"}
