import FacturaRepository from "../repositories/FacturaRepository";
import ApiClient from "../utils/ApiClient";

export default class FacturaService {
  static async listFacturas() {
    try {
      const data = await FacturaRepository.getAll();
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      return { success: false, message: data.error || "Error al obtener facturas" };
    } catch (error) {
      return { success: false, message: "Error al obtener facturas" };
    }
  }

  static async getFacturaById(id_pago) {
    try {
      const data = await FacturaRepository.getById(id_pago);
      if (data && !data.error) {
        return { success: true, data };
      }
      return { success: false, message: data.error || "Factura no encontrada" };
    } catch (error) {
      return { success: false, message: "Error al obtener factura" };
    }
  }

  static async createFactura(monto, metodo, estado_pago, prestamoId) {
    try {
      const newFactura = await FacturaRepository.add(
        monto,
        metodo,
        estado_pago,
        prestamoId
      );
      if (newFactura.error)
        return { success: false, message: newFactura.error };
      return { success: true, factura: newFactura };
    } catch (error) {
      return { success: false, message: "Error al crear factura" };
    }
  }

  static async updateFactura(id_pago, monto, metodo, estado_pago, prestamoId) {
    try {
      const updatedFactura = await FacturaRepository.update(
        id_pago,
        monto,
        metodo,
        estado_pago,
        prestamoId
      );
      if (updatedFactura.error)
        return { success: false, message: updatedFactura.error };

      return { success: true, factura: updatedFactura };
    } catch (error) {
      return { success: false, message: "Error al actualizar factura" };
    }
  }

  static async deleteFactura(id_pago) {
    try {
      const deletedFactura = await FacturaRepository.delete(id_pago);
      if (deletedFactura.error)
        return { success: false, message: deletedFactura.error };

      return { success: true, factura: deletedFactura };
    } catch (error) {
      return { success: false, message: "Error al eliminar factura" };
    }
  }
}
