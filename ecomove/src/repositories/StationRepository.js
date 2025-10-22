import ApiClient from "../utils/ApiClient";

export default class StationRepository {
  static async getAll() {
    const res = await ApiClient.get("/stations/");
    return res.data;
  }

  static async findById(id) {
    const res = await ApiClient.get(`/stations/${id}`);
    return res.data;
  }

  static async add(name, location, status = "operativo") {
    try {
      const res = await ApiClient.post("/stations/", {
        name,
        location,
        status,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al crear estación" };
    }
  }

  static async update(id, name, location, status) {
    try {
      const res = await ApiClient.put(`/stations/${id}`, {
        name,
        location,
        status,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al actualizar estación" };
    }
  }

  static async delete(id) {
    try {
      const res = await ApiClient.delete(`/stations/${id}`);
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al eliminar estación" };
    }
  }
}
