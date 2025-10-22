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
import VehicleService from "../../services/VehicleService";
import StationService from "../../services/StationService"; 
import EditVehicleModal from "../../components/EditVehicleModal";

export default function VehicleScreen() {
  const [type, setType] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [status, setStatus] = useState("disponible");
  const [stationId, setStationId] = useState("");

  const [stations, setStations] = useState([]); 
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // cargar estaciones operativas
  const loadStations = async () => {
    const result = await StationService.listStations();
    if (result.success) {
      const activeStations = result.data.filter(
        (station) => station.status === "operativo"
      );
      setStations(activeStations);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  // cargar vehículos
  const loadVehicles = async () => {
    const result = await VehicleService.listVehicles();
    if (result.success) {
      setVehicles(result.data);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  useEffect(() => {
    loadStations(); 
    loadVehicles();
  }, []);

  // agregar vehículo
  const handleAdd = async () => {
    if (!stationId) {
      Alert.alert("Error", "Debes seleccionar una estación operativa");
      return;
    }

    const result = await VehicleService.createVehicle(
      type,
      status,
      stationId,
      marca,
      modelo,
      tarifa
    );

    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }

    Alert.alert("Éxito", "Vehículo creado correctamente");
    setType("");
    setMarca("");
    setModelo("");
    setTarifa("");
    setStatus("disponible");
    setStationId("");
    loadVehicles();
  };

  // eliminar vehículo
  const handleDelete = async (id) => {
    const result = await VehicleService.deleteVehicle(id);
    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }
    Alert.alert("Éxito", "Vehículo eliminado");
    loadVehicles();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestionar Vehículos</Text>

      <TextInput
        placeholder="Tipo (ej: bicicleta, patineta)"
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
        placeholder="Tarifa (ej: 5000)"
        style={styles.input}
        value={tarifa}
        onChangeText={setTarifa}
        keyboardType="numeric"
      />

      {/* Picker para seleccionar estación operativa */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Estación</Text>
        <Picker
          selectedValue={stationId}
          onValueChange={(value) => setStationId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una estación" value="" />
          {stations.map((station) => (
            <Picker.Item
              key={station.id}
              label={station.name}
              value={station.id}
            />
          ))}
        </Picker>
      </View>

      {/* Picker para Estado */}
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

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar Vehículo</Text>
      </TouchableOpacity>

      <FlatList
        data={vehicles}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => {
          const stationId = item.station_id || item.stationId;
          const station = stations.find((s) => s.id === stationId);
          const stationName = station ? station.name : "Sin asignar";

          return (
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {item.type} - {item.marca} {item.modelo} | Tarifa: {item.tarifa} |{" "}
                Estación: {stationName} | ({item.status})
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#1565c0" }]}
                  onPress={() => {
                    setSelectedVehicle({
                      ...item,
                      stationId: stationId?.toString() || "",
                    });
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
          );
        }}
      />


      <EditVehicleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        vehicle={selectedVehicle}
        onSave={loadVehicles}
        stations={stations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#e3f2fd" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1565c0",
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
  button: {
    backgroundColor: "#1565c0",
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
