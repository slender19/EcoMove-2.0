import VehicleRepository from "../repositories/VehicleRepository";

export default class VehicleService {
  static async listVehicles() {
    try {
      const data = await VehicleRepository.getAll();
      if (Array.isArray(data)) return { success: true, data };
      return { success: false, message: data.error || "Error al obtener vehículos" };
    } catch (error) {
      console.error("Error listVehicles:", error);
      return { success: false, message: "Error al obtener vehículos" };
    }
  }

  static async getVehicleById(id) {
    try {
      const data = await VehicleRepository.getById(id);
      if (data && !data.error) return { success: true, data };
      return { success: false, message: data.error || "Vehículo no encontrado" };
    } catch (error) {
      console.error("Error getVehicleById:", error);
      return { success: false, message: "Error al obtener vehículo" };
    }
  }

 static async createVehicle(type, status, stationId, marca, modelo, tarifa, imagenFile = null) {
    try {
      const newVehicle = await VehicleRepository.add(type, status, stationId, marca, modelo, tarifa);
      if (newVehicle.error) return { success: false, message: newVehicle.error };

      if (imagenFile && imagenFile.uri) {
        const uploadResult = await VehicleRepository.uploadImage(newVehicle.id, imagenFile);
        if (uploadResult.error) {
          console.error("Error subiendo imagen:", uploadResult.error);
          return { success: false, message: uploadResult.error };
        }
      }

      return { success: true, vehicle: newVehicle };
    } catch (error) {
      console.error("Error createVehicle:", error);
      return { success: false, message: "Error al crear vehículo" };
    }
  }

  static async updateVehicle(id, type, status, stationId, marca, modelo, tarifa, imagenFile = null) {
    try {
      const updatedVehicle = await VehicleRepository.update(id, type, status, stationId, marca, modelo, tarifa);
      if (updatedVehicle.error) return { success: false, message: updatedVehicle.error };

      if (imagenFile && imagenFile.uri) {
        const uploadResult = await VehicleRepository.uploadImage(id, imagenFile);
        if (uploadResult.error) {
          console.error("Error subiendo imagen:", uploadResult.error);
          return { success: false, message: uploadResult.error };
        }
      }

      return { success: true, vehicle: updatedVehicle };
    } catch (error) {
      console.error("Error updateVehicle:", error);
      return { success: false, message: "Error al actualizar vehículo" };
    }
  }

  static async updateVehicleStatus(id, newStatus) {
    try {
      const result = await VehicleRepository.patch(id, { status: newStatus });
      if (result.error) return { success: false, message: result.error };
      return { success: true, data: result };
    } catch (error) {
      console.error("Error updateVehicleStatus:", error);
      return { success: false, message: "Error al actualizar estado del vehículo" };
    }
  }


  static async deleteVehicle(id) {
    try {
      const deletedVehicle = await VehicleRepository.delete(id);
      if (deletedVehicle.error)
        return { success: false, message: deletedVehicle.error };

      return { success: true, vehicle: deletedVehicle };
    } catch (error) {
      console.error("Error deleteVehicle:", error);
      return { success: false, message: "Error al eliminar vehículo" };
    }
  }

  static async uploadImage(vehicleId, imagenFile) {
    try {
      const res = await VehicleRepository.uploadImage(vehicleId, imagenFile);
      if (res.error) return { success: false, message: res.error };
      return { success: true, data: res };
    } catch (error) {
      console.error("Error uploadImage:", error);
      return { success: false, message: "Error al subir imagen del vehículo" };
    }
  }
}
