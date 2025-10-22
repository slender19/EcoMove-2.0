import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import StationService from "../../services/StationService";
import EditStationModal from "../../components/EditStationModal";

export default function StationScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("operativo");

  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar estaciones al abrir
  const loadStations = async () => {
    const result = await StationService.listStations();
    if (result.success) {
      setStations(result.data);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  // Agregar estación
  const handleAdd = async () => {
    const result = await StationService.createStation(name, location, status);
    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }
    Alert.alert("Éxito", "Estación creada correctamente");
    setName("");
    setLocation("");
    setStatus("operativo");
    loadStations(); // refrescar lista
  };

  // Eliminar estación
  const handleDelete = async (id) => {
    const result = await StationService.deleteStation(id);
    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }
    Alert.alert("Éxito", "Estación eliminada");
    loadStations(); // refrescar lista
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Estaciones</Text>

      {/* Inputs */}
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

      {/* Botón agregar */}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar Estación</Text>
      </TouchableOpacity>

      {/* Lista de estaciones */}
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.name} - {item.location} ({item.status})
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#1565c0" }]}
                onPress={() => {
                  setSelectedStation(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#d32f2f" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para editar */}
      <EditStationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        station={selectedStation}
        onSave={loadStations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e8f5e9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#2e7d32" },
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
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardText: { fontSize: 16, marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
});
