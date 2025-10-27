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
import Header from "../../components/header";

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
    if (result.success) setStations(result.data);
    else Alert.alert("Error", result.message);
  };

  useEffect(() => {
    loadStations();
  }, []);

  // Agregar estación
  const handleAdd = async () => {
    const result = await StationService.createStation(name, location, status);
    if (!result.success) return Alert.alert("Error", result.message);

    Alert.alert("Éxito", "Estación creada correctamente");
    setName("");
    setLocation("");
    setStatus("operativo");
    loadStations();
  };

  // Eliminar estación
  const handleDelete = async (id) => {
    const result = await StationService.deleteStation(id);
    if (!result.success) return Alert.alert("Error", result.message);

    Alert.alert("Éxito", "Estación eliminada");
    loadStations();
  };

  return (
    <>
      {/* HEADER SEPARADO */}
      <Header title="Gestionar estaciones" />

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.container}>
        {/* Inputs */}
        <Text style={styles.fieldLabel}>Nombre de la estación</Text>
        <TextInput
          placeholder="Ej. Plaza Central"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#8b9a83"
        />

        <Text style={styles.fieldLabel}>Ubicación</Text>
        <TextInput
          placeholder="Dirección o referencia"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#8b9a83"
        />

        {/* Picker para Estado */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerInner}>
            <Picker
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Operativo" value="operativo" />
              <Picker.Item label="Mantenimiento" value="mantenimiento" />
            </Picker>
          </View>
        </View>

        {/* Botón agregar */}
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Agregar estación</Text>
        </TouchableOpacity>

        {/* Lista de estaciones */}
        <Text style={styles.sectionTitle}>Estaciones</Text>
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardStatus}>
                  {item.status === "operativo" ? "Operativo" : item.status}
                </Text>
              </View>

              <Text style={styles.cardText}>{item.location}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => {
                    setSelectedStation(item);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    backgroundColor: "#f5f7f4",  
  },
  fieldLabel: {
    fontSize: 13,
    color: "#365b3a",
    marginBottom: 6,
    marginTop: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9ead7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    color: "#234422",
    fontSize: 15,
  },
  pickerContainer: {
    marginBottom: 14,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d9ead7",
    backgroundColor: "#fff",
  },
  pickerInner: {
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#456a45",
    paddingTop: 8,
    paddingLeft: 8,
  },
  picker: {
    height: 44,
    width: "100%",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f6f39",
    marginBottom: 8,
    marginTop: 6,
  },
  card: {
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#234422",
  },
  cardStatus: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "600",
    backgroundColor: "#e7f6ea",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#5a6a5a",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#4caf50",
  },
  deleteButton: {
    backgroundColor: "#e04b4b",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
