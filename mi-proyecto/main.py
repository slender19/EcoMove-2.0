from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import users, stations, vehicles


Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoMove API (FastAPI + SQLite)")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(stations.router)
app.include_router(vehicles.router)

@app.get("/")
def read_root():
    return {"message": "API con FastAPI + SQLite funcionando"}
