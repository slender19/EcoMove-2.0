import ApiClient from "../utils/ApiClient";

export default class VehicleRepository {
  static async getAll() {
    const res = await ApiClient.get("/vehicles/");
    return res.data;
  }

  static async findById(id) {
    const res = await ApiClient.get(`/vehicles/${id}`);
    return res.data;
  }

  static async add(type, status, stationId, marca, modelo, tarifa) {
    try {
      const res = await ApiClient.post("/vehicles/", {
        type,
        status,
        station_id: stationId,
        marca,
        modelo,
        tarifa,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al crear vehículo" };
    }
  }

  static async update(id, type, status, stationId, marca, modelo, tarifa) {
    try {
      const res = await ApiClient.put(`/vehicles/${id}`, {
        type,
        status,
        station_id: stationId,
        marca,
        modelo,
        tarifa,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al actualizar vehículo" };
    }
  }

  static async delete(id) {
    try {
      const res = await ApiClient.delete(`/vehicles/${id}`);
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al eliminar vehículo" };
    }
  }
}
