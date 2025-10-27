export default class Loan {
  constructor(
    id,
    estacion_origen,
    estacion_destino,
    fecha_hora_inicio,
    fecha_hora_fin,
    duracion,
    costo_calculado,
    usuario,
    vehiculo,
    estado 
  ) {
    this.id = id;
    this.estacion_origen = estacion_origen;
    this.estacion_destino = estacion_destino;
    this.fecha_hora_inicio = fecha_hora_inicio;
    this.fecha_hora_fin = fecha_hora_fin;
    this.duracion = duracion;
    this.costo_calculado = costo_calculado;
    this.usuario = usuario;
    this.vehiculo = vehiculo;
    this.estado = estado; 
  }
}

export class LoanValidator {
  static validate({
    estacion_origen,
    estacion_destino,
    fecha_hora_inicio,
    fecha_hora_fin,
    usuario,
    vehiculo,
  }) {
    if (!estacion_origen || !estacion_destino)
      throw new Error("Debe seleccionar estación de origen y destino");

    if (!fecha_hora_inicio || !fecha_hora_fin)
      throw new Error("Debe especificar fecha y hora de inicio y fin");

    if (!usuario || usuario <= 0)
      throw new Error("Debe especificar un usuario válido");

    if (!vehiculo || vehiculo <= 0)
      throw new Error("Debe seleccionar un vehículo válido");
  }
}
