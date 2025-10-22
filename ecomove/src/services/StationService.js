import StationRepository from "../repositories/StationRepository";

export default class StationService {

 static async listStations() {
    try {
      const data = await StationRepository.getAll();
      if (Array.isArray(data)) {
        return { success: true, data }; 
      }
      return { success: false, message: data.error || "Error al obtener estaciones" };
    } catch (error) {
      return { success: false, message: "Error al obtener estaciones" };
    }
  }

  static async createStation(name, location, status = "operativo") {
    try {
      const newStation = await StationRepository.add(name, location, status);
      if (newStation.error) return { success: false, message: newStation.error };

      return { success: true, station: newStation };
    } catch (error) {
      return { success: false, message: "Error al crear estación" };
    }
  }

  static async updateStation(id, name, location, status) {
    try {
      const updatedStation = await StationRepository.update(
        id,
        name,
        location,
        status
      );
      if (updatedStation.error)
        return { success: false, message: updatedStation.error };

      return { success: true, station: updatedStation };
    } catch (error) {
      return { success: false, message: "Error al actualizar estación" };
    }
  }

  static async deleteStation(id) {
    try {
      const deletedStation = await StationRepository.delete(id);
      if (deletedStation.error)
        return { success: false, message: deletedStation.error };

      return { success: true, station: deletedStation };
    } catch (error) {
      return { success: false, message: "Error al eliminar estación" };
    }
  }
}
