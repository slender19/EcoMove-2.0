import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
  const [imagen, setImagen] = useState(null);
  const [initialImage, setInitialImage] = useState(null);

  // Cargar datos del vehículo
  useEffect(() => {
    if (vehicle) {
      setType(vehicle.type ?? "");
      setMarca(vehicle.marca ?? "");
      setModelo(vehicle.modelo ?? "");
      setTarifa(vehicle.tarifa != null ? String(vehicle.tarifa) : "");
      setStatus(vehicle.status ?? "disponible");

      const id = vehicle.station_id ?? vehicle.stationId ?? "";
      setStationId(id ? String(id) : "");

      const img = vehicle.imagen ?? null;
      setImagen(img);
      setInitialImage(img);
    } else {
      setType("");
      setMarca("");
      setModelo("");
      setTarifa("");
      setStatus("disponible");
      setStationId("");
      setImagen(null);
      setInitialImage(null);
    }
  }, [vehicle]);

  const stringifyMsg = (maybe) => {
    if (maybe == null) return "";
    if (typeof maybe === "string") return maybe;
    try {
      return typeof maybe === "object" ? JSON.stringify(maybe) : String(maybe);
    } catch {
      return String(maybe);
    }
  };

  // ---- Seleccionar imagen desde galería ----
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitas otorgar acceso a tus fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setImagen(asset.uri);
      }
    } catch (error) {
      console.error("Error al abrir galería:", error);
      Alert.alert("Error", "No se pudo abrir la galería de imágenes.");
    }
  };

  // ---- Guardar cambios ----
  const handleSave = async () => {
    if (!type.trim() || !marca.trim() || !modelo.trim() || !tarifa.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    const tarifaNum = Number(tarifa);
    if (Number.isNaN(tarifaNum) || tarifaNum <= 0) {
      Alert.alert("Error", "La tarifa debe ser un número positivo.");
      return;
    }

    const stationInt = stationId === "" ? null : parseInt(stationId, 10);

    try {
      let imageUrl = initialImage;
      
      if (imagen && imagen.startsWith("file://") && imagen !== initialImage) {
        const uploadRes = await VehicleService.uploadImage(vehicle.id, imagen);
        if (uploadRes?.success && uploadRes?.url) {
          imageUrl = uploadRes.url;
        } else {
          Alert.alert(
            "Advertencia",
            "No se pudo subir la imagen. Se mantendrá la anterior."
          );
        }
      }

      const result = await VehicleService.updateVehicle(
        vehicle.id,
        type,
        status,
        stationInt,
        marca,
        modelo,
        tarifaNum,
        imageUrl
      );

      if (!result) {
        Alert.alert("Error", "Respuesta vacía del servidor");
        return;
      }

      if (result.error) {
        Alert.alert("Error", stringifyMsg(result.error));
        return;
      }

      if (result.success === false) {
        const msg =
          result.message ?? result.detail ?? "No se pudo actualizar el vehículo";
        Alert.alert("Error", stringifyMsg(msg));
        return;
      }

      const updated = result.vehicle ?? result;
      Alert.alert("Éxito", "Vehículo actualizado correctamente.");
      onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error en updateVehicle:", error);
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Hubo un problema con la actualización.";
      Alert.alert("Error", stringifyMsg(msg));
    }
  };

  if (!vehicle) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView>
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

            {/* Imagen */}
            <View style={styles.imageContainer}>
              <Text style={styles.label}>Imagen del vehículo</Text>
              {imagen ? (
                <Image source={{ uri: imagen }} style={styles.imagePreview} />
              ) : (
                <Text style={{ color: "#999", marginBottom: 5 }}>
                  No hay imagen seleccionada
                </Text>
              )}
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
            </View>

            {/* Picker Estación */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Estación</Text>
              <Picker
                selectedValue={stationId}
                onValueChange={(value) => setStationId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Sin asignar" value="" />
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <Picker.Item
                      key={station.id}
                      label={station.name ?? station.nombre ?? "Sin nombre"}
                      value={String(station.id)}
                    />
                  ))
                ) : (
                  <Picker.Item label="(No hay estaciones)" value="" />
                )}
              </Picker>
            </View>

            {/* Picker Estado */}
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

            {/* Botones */}
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
          </ScrollView>
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
    maxHeight: "90%",
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
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  uploadText: { color: "#fff", fontWeight: "bold" },
});
