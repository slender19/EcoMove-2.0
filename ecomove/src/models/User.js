export default class User {
  constructor(id, name, cedula, email, password, role = "user") {
    this.id = id;
    this.name = name;
    this.cedula = cedula;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class UserValidator {
  static validate({ id, name, cedula, email, password, role }) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (!cedula || isNaN(Number(cedula))) {
      throw new Error("La cédula debe ser numérica");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Correo electrónico inválido");
    }

    if (!password || password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    if (!["user", "admin"].includes(role)) {
      throw new Error("Rol inválido");
    }
  }
}
