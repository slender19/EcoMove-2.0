from passlib.context import CryptContext

# Configura bcrypt para manejar el hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para encriptar la contraseña antes de guardarla
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Función para verificar una contraseña ingresada con la guardada
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
