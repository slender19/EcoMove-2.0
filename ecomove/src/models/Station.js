export default class Station {
  constructor(id, name, location, status = "operativo") {
    this.id = id;
    this.name = name;
    this.location = location;
    this.status = status; 
  }
}

export class StationValidator {
  static validate({ id, name, location, status }) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      throw new Error("El nombre de la estación debe tener al menos 3 caracteres");
    }

    if (!location || location.trim().length < 5) {
      throw new Error("La ubicación debe ser válida");
    }

    if (!["operativo", "mantenimiento"].includes(status)) {
      throw new Error("Estado inválido. Debe ser 'operativo' o 'mantenimiento'");
    }
  }
}
