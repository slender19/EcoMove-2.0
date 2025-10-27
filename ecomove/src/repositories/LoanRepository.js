import ApiClient from "../utils/ApiClient";

export default class LoanRepository {
  static async getAll() {
    try {
      const res = await ApiClient.get("/prestamos/");
      return res.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || "Error al obtener préstamos",
      };
    }
  }

  static async findById(id) {
    try {
      const res = await ApiClient.get(`/prestamos/${id}`);
      return res.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || "Error al obtener préstamo",
      };
    }
  }

  static async getByUserId(userId) {
    try {
      const res = await ApiClient.get(`/prestamos/usuario/${userId}`);
      return res.data;
    } catch (error) {
      return {
        error:
          error.response?.data?.detail ||
          "Error al obtener préstamos del usuario",
      };
    }
  }

  static async add(data) {
    try {
      const res = await ApiClient.post("/prestamos/", data);
      return res.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || "Error al crear préstamo",
      };
    }
  }

  static async update(id, data) {
    try {
      const res = await ApiClient.put(`/prestamos/${id}`, data);
      return res.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || "Error al actualizar préstamo",
      };
    }
  }

  static async delete(id) {
    try {
      const res = await ApiClient.delete(`/prestamos/${id}`);
      return res.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || "Error al eliminar préstamo",
      };
    }
  }
}
