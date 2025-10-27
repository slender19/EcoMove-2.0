import ApiClient from "../utils/ApiClient";

export default class VehicleRepository {
  static async getAll() {
    try {
      const res = await ApiClient.get("/vehicles/");
      return res.data;
    } catch (error) {
      console.error("Error getAll:", error);
      return { error: error.response?.data?.detail || "Error al obtener vehículos" };
    }
  }

  static async getById(id) {
    try {
      const res = await ApiClient.get(`/vehicles/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error getById:", error);
      return { error: error.response?.data?.detail || "Error al obtener vehículo" };
    }
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
      console.error("Error creando vehículo:", error.response?.data || error);
      return { error: error.response?.data?.detail || "Error al crear vehículo" };
    }
  }

  static async uploadImage(vehicleId, imagenFile) {
    try {
      if (!imagenFile || !imagenFile.uri) {
        return { error: "No se proporcionó archivo de imagen" };
      }

      const formData = new FormData();
      formData.append("file", {
        uri: imagenFile.uri,
        name: imagenFile.name || `vehiculo_${Date.now()}.jpg`,
        type: imagenFile.type || "image/jpeg",
      });

      const base = ApiClient.defaults.baseURL || "";
      const url = `${base}/vehicles/${vehicleId}/upload-image`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Upload failed, status:", res.status, "body:", text);
        return { error: `HTTP ${res.status}` };
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error subiendo imagen del vehículo:", error);
      return { error: "Error al subir imagen (ver conexión/servidor)" };
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
      console.error("Error actualizando vehículo:", error.response?.data || error);
      return { error: error.response?.data?.detail || "Error al actualizar vehículo" };
    }
  }
  
  static async patch(id, partialData) {
  try {
    const res = await ApiClient.patch(`/vehicles/${id}`, partialData);
    return res.data;
  } catch (error) {
    console.error("Error haciendo PATCH de vehículo:", error.response?.data || error);
    return { error: error.response?.data?.detail || "Error al actualizar vehículo parcialmente" };
  }
}

  static async delete(id) {
    try {
      const res = await ApiClient.delete(`/vehicles/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error eliminando vehículo:", error.response?.data || error);
      return { error: error.response?.data?.detail || "Error al eliminar vehículo" };
    }
  }
}
