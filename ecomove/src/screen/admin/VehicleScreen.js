import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import VehicleService from "../../services/VehicleService";
import StationService from "../../services/StationService";
import EditVehicleModal from "../../components/EditVehicleModal";
import ImagePickerField from "../../components/ImagePickerField";
import Header from "../../components/header";

export default function VehicleScreen() {
  const [type, setType] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [status, setStatus] = useState("disponible");
  const [stationId, setStationId] = useState("");
  const [imagen, setImagen] = useState(null);

  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  // 🔹 Crear vehículo
const handleAdd = async () => {
  if (!type.trim() || !marca.trim() || !modelo.trim() || !tarifa.trim()) {
    Alert.alert("Error", "Por favor completa todos los campos.");
    return;
  }

  if (!stationId) {
    Alert.alert("Error", "Debes seleccionar una estación operativa.");
    return;
  }

  const result = await VehicleService.createVehicle(
    type,
    status,
    stationId,
    marca,
    modelo,
    tarifa,
    imagen 
  );

  if (!result.success) {
    Alert.alert("Error", result.message);
    return;
  }

  Alert.alert("Éxito", "Vehículo creado correctamente.");
  setType("");
  setMarca("");
  setModelo("");
  setTarifa("");
  setStatus("disponible");
  setStationId("");
  setImagen(null);
  loadVehicles();
};


  // 🔹 Eliminar vehículo
  const handleDelete = async (id) => {
    const result = await VehicleService.deleteVehicle(id);
    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }
    Alert.alert("Éxito", "Vehículo eliminado correctamente.");
    loadVehicles();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "disponible":
        return { backgroundColor: "#C8E6C9", color: "#1B5E20" };
      case "en uso":
        return { backgroundColor: "#FFF9C4", color: "#F57F17" };
      case "mantenimiento":
        return { backgroundColor: "#FFCDD2", color: "#B71C1C" };
      default:
        return { backgroundColor: "#E0E0E0", color: "#424242" };
    }
  };

  return (
    <>
      <Header title="Gestión de Vehículos" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
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

            <ImagePickerField
              label="Imagen del vehículo"
              imageUri={imagen}
              onChange={setImagen}
            />

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

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Estado del vehículo</Text>
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
          </View>

          {/* 🔹 Lista de vehículos */}
          <FlatList
            data={vehicles}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : index.toString()
            }
            scrollEnabled={false}
            renderItem={({ item }) => {
              const stationId = item.station_id || item.stationId;
              const station = stations.find((s) => s.id === stationId);
              const stationName = station ? station.name : "Sin asignar";
              const statusStyle = getStatusStyle(item.status);

              const imageUrl = item.imagen?.startsWith("http")
                ? item.imagen
                : item.imagen
                ? `http://192.168.80.12:8000${item.imagen}`
                : null;

              return (
                <View style={styles.card}>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: "100%", height: 140, borderRadius: 10, resizeMode: "contain", backgroundColor: "#fff" }}
                    />
                  )}

                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {item.type} - {item.marca} {item.modelo}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardText}>
                    Tarifa: {item.tarifa} | Estación: {stationName}
                  </Text>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
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
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={styles.actionText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <EditVehicleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        vehicle={selectedVehicle}
        onSave={loadVehicles}
        stations={stations}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  formContainer: {
    padding: 18,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d9e2ec",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9e2ec",
    marginBottom: 12,
    overflow: "hidden",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2f3e46",
    marginLeft: 12,
    marginTop: 8,
  },
  picker: { height: 48, width: "100%" },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#2f3e46" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 13, fontWeight: "600" },
  cardText: { fontSize: 15, color: "#37474f", marginBottom: 10, lineHeight: 20 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  editButton: { backgroundColor: "#0288d1" },
  deleteButton: { backgroundColor: "#c62828" },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
