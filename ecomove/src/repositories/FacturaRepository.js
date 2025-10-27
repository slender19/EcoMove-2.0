import ApiClient from "../utils/ApiClient";

export default class FacturaRepository {
  static async getAll() {
    try {
      const res = await ApiClient.get("/facturas/");
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al obtener facturas" };
    }
  }

  static async getById(id_pago) {
    try {
      const res = await ApiClient.get(`/facturas/${id_pago}`);
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al obtener factura" };
    }
  }

  static async add(monto, metodo, estado_pago, prestamo) {
    try {
      const res = await ApiClient.post("/facturas/", {
        monto,
        metodo,
        estado_pago,
        prestamo,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al crear factura" };
    }
  }

  static async update(id_pago, monto, metodo, estado_pago, prestamo) {
    try {
      const res = await ApiClient.put(`/facturas/${id_pago}`, {
        monto,
        metodo,
        estado_pago,
        prestamo,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al actualizar factura" };
    }
  }

  static async delete(id_pago) {
    try {
      const res = await ApiClient.delete(`/facturas/${id_pago}`);
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al eliminar factura" };
    }
  }
}
