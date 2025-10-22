import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import VehicleService from "../services/VehicleService";

export default function EditVehicleModal({
  visible,
  onClose,
  vehicle,
  onSave,
  stations = [],
}) {
  const [type, setType] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [status, setStatus] = useState("disponible");
  const [stationId, setStationId] = useState(""); 

  useEffect(() => {
    if (vehicle) {
      setType(vehicle.type ?? "");
      setMarca(vehicle.marca ?? "");
      setModelo(vehicle.modelo ?? "");
      setTarifa(vehicle.tarifa != null ? String(vehicle.tarifa) : "");
      setStatus(vehicle.status ?? "disponible");

      const id = vehicle.station_id ?? vehicle.stationId ?? null;
      setStationId(id != null ? String(id) : "");
    } else {
      setType("");
      setMarca("");
      setModelo("");
      setTarifa("");
      setStatus("disponible");
      setStationId("");
    }
  }, [vehicle]);

  const _stringifyMsg = (maybe) => {
    if (maybe == null) return "";
    if (typeof maybe === "string") return maybe;
    try {
      return typeof maybe === "object" ? JSON.stringify(maybe) : String(maybe);
    } catch {
      return String(maybe);
    }
  };

  const handleSave = async () => {
    if (!type.trim() || !marca.trim() || !modelo.trim() || !tarifa.trim() || !status.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos (excepto estación si no aplica).");
      return;
    }

    const tarifaNum = Number(tarifa);
    if (Number.isNaN(tarifaNum)) {
      Alert.alert("Error", "La tarifa debe ser un número válido.");
      return;
    }

    const stationInt = stationId === "" ? null : parseInt(stationId, 10);

    try {
      const result = await VehicleService.updateVehicle(
        vehicle.id,
        type,
        status,
        stationInt,
        marca,
        modelo,
        tarifaNum
      );

      if (!result) {
        Alert.alert("Error", "Respuesta vacía del servidor");
        return;
      }

      if (result.error) {
        Alert.alert("Error", _stringifyMsg(result.error));
        return;
      }
      if (result.success === false) {
        const msg = result.message ?? result.detail ?? "No se pudo actualizar el vehículo";
        Alert.alert("Error", _stringifyMsg(msg));
        return;
      }

      const updated = result.vehicle ?? result;

      Alert.alert("Éxito", "Vehículo actualizado correctamente.");
      try {
        onSave(updated);
      } catch {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error("Error en updateVehicle:", error);
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Hubo un problema con la actualización.";
      Alert.alert("Error", _stringifyMsg(msg));
    }
  };

  if (!vehicle) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Editar Vehículo</Text>

          <Text style={styles.label}>ID (no editable): {vehicle.id}</Text>

          <TextInput
            placeholder="Tipo"
            style={styles.input}
            value={type}
            onChangeText={setType}
          />

          <TextInput
            placeholder="Marca"
            style={styles.input}
            value={marca}
            onChangeText={setMarca}
          />

          <TextInput
            placeholder="Modelo"
            style={styles.input}
            value={modelo}
            onChangeText={setModelo}
          />

          <TextInput
            placeholder="Tarifa"
            style={styles.input}
            value={tarifa}
            onChangeText={setTarifa}
            keyboardType="numeric"
          />

          {/* Picker para seleccionar estación */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Estación</Text>
            <Picker
              selectedValue={stationId}
              onValueChange={(value) => setStationId(value)}
              style={styles.picker}
            >
              <Picker.Item label="Sin asignar" value="" />
              {stations.map((station) => (
                <Picker.Item
                  key={station.id}
                  label={station.name ?? station.nombre ?? "Sin nombre"}
                  value={String(station.id)}
                />
              ))}
            </Picker>
          </View>

          {/* Picker para estado */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Estado</Text>
            <Picker
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Disponible" value="disponible" />
              <Picker.Item label="En uso" value="en uso" />
              <Picker.Item label="Mantenimiento" value="mantenimiento" />
            </Picker>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#1565c0" }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#d32f2f" }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  picker: { height: 50, width: "100%" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
