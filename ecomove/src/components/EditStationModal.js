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
import StationService from "../services/StationService";

export default function EditStationModal({ visible, onClose, station, onSave }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("operativo");

  useEffect(() => {
    if (station) {
      setName(station.name);
      setLocation(station.location);
      setStatus(station.status);
    }
  }, [station]);

  const handleSave = async () => {
    if (!station) return;

    if (!name.trim() || !location.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      const result = await StationService.updateStation(
        station.id,
        name,
        location,
        status
      );

      if (!result.success) {
        Alert.alert("Error", result.message || "No se pudo actualizar la estación");
        return;
      }

      onSave(); 
      onClose();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con la actualización.");
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Estación</Text>

          <TextInput
            placeholder="Nombre de la estación"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          {/* Picker para Estado */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Estado</Text>
            <Picker
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Operativo" value="operativo" />
              <Picker.Item label="Mantenimiento" value="mantenimiento" />
            </Picker>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2e7d32" }]}
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2e7d32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5,
    color: "#333",
  },
  picker: { height: 50, width: "100%" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
