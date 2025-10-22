export default class Vehicle {
  constructor(id, type, status, stationId, marca, modelo, tarifa) {
    this.id = id;
    this.type = type;          
    this.status = status;     
    this.stationId = stationId; 
    this.marca = marca;       
    this.modelo = modelo;      
    this.tarifa = tarifa;     
  }
}

export class VehicleValidator {
  static validate({ id, type, status, stationId, marca, modelo, tarifa }) {
    if (!id || id <= 0) {
      throw new Error("ID inválido");
    }

    if (!type || typeof type !== "string" || type.trim().length < 3) {
      throw new Error("El tipo de vehículo debe tener al menos 3 caracteres");
    }

    if (!["disponible", "en uso", "mantenimiento"].includes(status)) {
      throw new Error("Estado inválido");
    }

    if (!stationId || stationId <= 0) {
      throw new Error("El vehículo debe estar asociado a una estación válida");
    }

    if (!marca || typeof marca !== "string" || marca.trim().length < 2) {
      throw new Error("La marca del vehículo debe tener al menos 2 caracteres");
    }

    if (!modelo || typeof modelo !== "string" || modelo.trim().length < 2) {
      throw new Error("El modelo del vehículo debe tener al menos 2 caracteres");
    }

    if (tarifa === undefined || tarifa <= 0) {
      throw new Error("La tarifa del vehículo debe ser un número mayor que 0");
    }
  }
}
