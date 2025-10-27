import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import VehicleService from "../services/VehicleService";

export default function SelectVehicleModal({ visible, onClose, onSelect, stationId }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && stationId != null) {
      fetchVehicles();
    } else {
      setVehicles([]);
    }
  }, [visible, stationId]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await VehicleService.listVehicles();
      if (res?.success && Array.isArray(res.data)) {
        const filtered = res.data.filter(
          (v) =>
            (v.status === "disponible" || v.status === "available") &&
            Number(v.station_id ?? v.stationId) === Number(stationId)
        );
        setVehicles(filtered);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error cargando vehículos:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (vehicle) => {
    if (onSelect) onSelect(vehicle);
    if (onClose) onClose();
  };

  const renderVehicle = ({ item }) => {
    const BASE_URL = "http://192.168.80.12:8000"; 
    const imageUri = item.imagen
      ? item.imagen.startsWith("http")
        ? item.imagen
        : `${BASE_URL}${item.imagen}`
      : null;

    console.log("🚗 Vehículo cargado:", item);
    console.log("🖼️ URL final de imagen:", imageUri);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelect(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.noImage}>
              <MaterialCommunityIcons name="car" size={40} color="#999" />
              <Text style={styles.noImageText}>Sin imagen</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.vehicleTitle}>
              {item.marca} {item.modelo}
            </Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{item.type ?? "Vehículo"}</Text>
            </View>
          </View>

          <Text style={styles.tarifa}>
            Tarifa: <Text style={styles.tarifaBold}>${item.tarifa}/h</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.headerTitle}>Vehículos disponibles</Text>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#2e7d32" />
              <Text style={styles.loadingText}>Cargando vehículos...</Text>
            </View>
          ) : vehicles.length > 0 ? (
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
              renderItem={renderVehicle}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 15 }}
            />
          ) : (
            <View style={styles.centerContent}>
              <MaterialCommunityIcons name="car-off" size={40} color="#777" />
              <Text style={styles.emptyText}>
                No hay vehículos disponibles en esta estación
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <MaterialCommunityIcons name="close" size={22} color="#fff" />
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#f9fff5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6e9c6",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#eef3ee",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", 
    backgroundColor: "#fff", 
  },
  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#999",
    fontSize: 13,
    marginTop: 4,
  },
  infoContainer: {
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  typeTag: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tarifa: {
    fontSize: 14,
    color: "#333",
  },
  tarifaBold: {
    fontWeight: "700",
    color: "#2e7d32",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  emptyText: {
    marginTop: 10,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
