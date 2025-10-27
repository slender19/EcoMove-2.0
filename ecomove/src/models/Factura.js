export default class Factura {
  constructor(id_pago, monto, metodo, estado_pago, prestamo) {
    this.id_pago = id_pago;        
    this.monto = monto;             
    this.metodo = metodo;           
    this.estado_pago = estado_pago; 
    this.prestamo = prestamo;       
  }
}

export class FacturaValidator {
  static validate({ id_pago, monto, metodo, estado_pago, prestamo }) {
    if (!id_pago || id_pago <= 0) {
      throw new Error("ID de pago inválido");
    }

    if (monto === undefined || monto <= 0) {
      throw new Error("El monto debe ser un número mayor que 0");
    }

    if (!metodo || typeof metodo !== "string" || metodo.trim().length < 3) {
      throw new Error("Método de pago inválido");
    }

    if (!["pendiente", "pagado", "rechazado"].includes(estado_pago)) {
      throw new Error("Estado de pago inválido");
    }

    if (!prestamo || prestamo <= 0) {
      throw new Error("La factura debe estar asociada a un préstamo válido");
    }
  }
}
