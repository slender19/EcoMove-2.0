import LoanRepository from "../repositories/LoanRepository";
import { LoanValidator } from "../models/Loan";
import VehicleService from "../services/VehicleService";
import Loan from "../models/Loan";

export default class LoanService {
  static async listLoans() {
    try {
      const data = await LoanRepository.getAll();
      if (Array.isArray(data)) return { success: true, data };

      return { success: false, message: data.error };
    } catch {
      return { success: false, message: "Error al obtener préstamos" };
    }
  }

  static async getLoanById(id) {
    try {
      const loan = await LoanRepository.findById(id);
      if (loan.error) return { success: false, message: loan.error };

      return { success: true, loan };
    } catch {
      return { success: false, message: "Error al obtener préstamo" };
    }
  }

  static async getLoansByUserId(userId) {
    try {
      const res = await LoanRepository.getByUserId(userId);

      if (Array.isArray(res)) return res;
      if (Array.isArray(res.data)) return res.data;

      console.warn("Respuesta inesperada del servidor:", res);
      return [];
    } catch (error) {
      console.error("Error al obtener préstamos del usuario:", error);
      return [];
    }
  }

  static async createLoan({
    estacion_origen,
    estacion_destino,
    fecha_hora_inicio,
    fecha_hora_fin,
    usuario,
    vehiculo,
  }) {
    try {
      LoanValidator.validate({
        estacion_origen,
        estacion_destino,
        fecha_hora_inicio,
        fecha_hora_fin,
        usuario,
        vehiculo,
      });

      const vehiculoData = await VehicleService.getVehicleById(vehiculo);
      if (!vehiculoData || vehiculoData.error) {
        return {
          success: false,
          message: "No se pudo obtener la información del vehículo",
        };
      }

      const duracion =
        (new Date(fecha_hora_fin) - new Date(fecha_hora_inicio)) / 3600000;
      const costo_calculado = duracion * vehiculoData.tarifa;

   
      const estado = "activo";

      const newLoan = new Loan(
        null,
        estacion_origen,
        estacion_destino,
        fecha_hora_inicio,
        fecha_hora_fin,
        duracion,
        costo_calculado,
        usuario,
        vehiculo,
        estado
      );

      const res = await LoanRepository.add(newLoan);
      if (res.error) return { success: false, message: res.error };

      return { success: true, loan: res };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error al crear préstamo",
      };
    }
  }

  static async updateLoan(id, data) {
    try {
      const res = await LoanRepository.update(id, data);
      if (res.error) return { success: false, message: res.error };

      return { success: true, loan: res };
    } catch {
      return { success: false, message: "Error al actualizar préstamo" };
    }
  }

  static async deleteLoan(id) {
    try {
      const res = await LoanRepository.delete(id);
      if (res.error) return { success: false, message: res.error };

      return { success: true, loan: res };
    } catch {
      return { success: false, message: "Error al eliminar préstamo" };
    }
  }
}
