import VehicleRepository from "../repositories/VehicleRepository";

export default class VehicleService {

  static async listVehicles() {
    try {
      const data = await VehicleRepository.getAll();
      if (Array.isArray(data)) {
        return { success: true, data };
      }
      return { success: false, message: data.error || "Error al obtener vehículos" };
    } catch (error) {
      return { success: false, message: "Error al obtener vehículos" };
    }
  }

  static async createVehicle(type, status, stationId, marca, modelo, tarifa) {
    try {
      const newVehicle = await VehicleRepository.add(
        type,
        status,
        stationId,
        marca,
        modelo,
        tarifa
      );
      if (newVehicle.error)
        return { success: false, message: newVehicle.error };

      return { success: true, vehicle: newVehicle };
    } catch (error) {
      return { success: false, message: "Error al crear vehículo" };
    }
  }

  static async updateVehicle(
    id,
    type,
    status,
    stationId,
    marca,
    modelo,
    tarifa
  ) {
    try {
      const updatedVehicle = await VehicleRepository.update(
        id,
        type,
        status,
        stationId,
        marca,
        modelo,
        tarifa
      );
      if (updatedVehicle.error)
        return { success: false, message: updatedVehicle.error };

      return { success: true, vehicle: updatedVehicle };
    } catch (error) {
      return { success: false, message: "Error al actualizar vehículo" };
    }
  }

  static async deleteVehicle(id) {
    try {
      const deletedVehicle = await VehicleRepository.delete(id);
      if (deletedVehicle.error)
        return { success: false, message: deletedVehicle.error };

      return { success: true, vehicle: deletedVehicle };
    } catch (error) {
      return { success: false, message: "Error al eliminar vehículo" };
    }
  }
}
