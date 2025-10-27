import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import StationService from "../../services/StationService";
import VehicleService from "../../services/VehicleService";
import PrestamoService from "../../services/LoanService";
import SelectVehicleModal from "../../components/SelectVehicleModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";

export default function Solicitar() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState("inicioFecha");

  const [summaryVisible, setSummaryVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadStations();
    loadUser();
  }, []);

  const loadStations = async () => {
    setLoadingStations(true);
    try {
      const res = await StationService.listStations();
      if (res && res.success) {
        const operativas = res.data.filter(
          (s) => s.status === "operativo" || s.estado === "operativo"
        );
        setStations(operativas);
      } else {
        Alert.alert("Error", "No se pudieron cargar las estaciones.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Ocurrió un error al cargar estaciones.");
    } finally {
      setLoadingStations(false);
    }
  };

  const loadUser = async () => {
    try {
      const u = await AsyncStorage.getItem("currentUser");
      if (u) setCurrentUser(JSON.parse(u));
    } catch (e) {
      console.error("Error cargando usuario:", e);
    }
  };

  const handleSelectOrigin = (station) => {
    setOrigin(station);
    setSelectedVehicle(null);
    setDestination(null);
    setSummaryVisible(false);
    setVehicleModalVisible(true);
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleModalVisible(false);
    setSummaryVisible(false);
  };

  const handleSelectDestination = (station) => {
    if (!origin) {
      Alert.alert("Aviso", "Primero selecciona la estación de origen.");
      return;
    }
    if (station.id === origin.id) {
      Alert.alert("Error", "La estación destino no puede ser igual a la de origen");
      return;
    }
    setDestination(station);
    setSummaryVisible(false);
  };

  const calculateDurationAndCost = () => {
    if (!selectedVehicle) return { duration: "0.00", cost: "0.00" };
    const diffMs = endDate - startDate;
    const hours = diffMs / (1000 * 60 * 60);
    const duration = hours > 0 ? hours : 0;
    const tarifa = selectedVehicle.tarifa ?? selectedVehicle.price ?? 0;
    const costo = duration * tarifa;
    return {
      duration: duration.toFixed(2),
      cost: costo.toFixed(2),
    };
  };

  const handleConfirm = async () => {
    if (!origin || !destination || !selectedVehicle) {
      Alert.alert("Error", "Completa origen, destino y vehículo antes de confirmar.");
      return;
    }

    if (endDate <= startDate) {
      Alert.alert("Error", "La fecha y hora final deben ser posteriores a la de inicio.");
      return;
    }

    const { duration, cost } = calculateDurationAndCost();

    const prestamoPayload = {
      usuario: currentUser?.id ?? null,
      estacion_origen: origin.name,
      estacion_destino: destination.name,
      fecha_hora_inicio: startDate.toISOString(),
      fecha_hora_fin: endDate.toISOString(),
      duracion: Number(duration),
      costo_calculado: Number(cost),
      vehiculo: selectedVehicle.id,
    };

    try {
      const res = await PrestamoService.createLoan(prestamoPayload);
      if (res && res.success) {
        await VehicleService.updateVehicleStatus(selectedVehicle.id, "en uso");
        Alert.alert("Éxito", "Préstamo registrado correctamente.");
        setOrigin(null);
        setDestination(null);
        setSelectedVehicle(null);
        setSummaryVisible(false);
        loadStations();
      } else {
        Alert.alert("Error", res?.message || "No se pudo guardar el préstamo.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Ocurrió un error al guardar el préstamo.");
    }
  };

  const openPicker = (type) => {
    if (type === "inicio") setPickerMode("inicioFecha");
    else setPickerMode("finFecha");
    setPickerVisible(true);
  };

  const onPickerChange = (event, selected) => {
    if (event.type === "dismissed") {
      setPickerVisible(false);
      return;
    }
    if (!selected) return;

    if (pickerMode === "inicioFecha") {
      const newDate = new Date(startDate);
      newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setStartDate(newDate);
      if (Platform.OS === "android") setPickerMode("inicioHora");
    } else if (pickerMode === "inicioHora") {
      const newDate = new Date(startDate);
      newDate.setHours(selected.getHours(), selected.getMinutes());
      setStartDate(newDate);
      setPickerVisible(false);
    } else if (pickerMode === "finFecha") {
      const newDate = new Date(endDate);
      newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setEndDate(newDate);
      if (Platform.OS === "android") setPickerMode("finHora");
    } else if (pickerMode === "finHora") {
      const newDate = new Date(endDate);
      newDate.setHours(selected.getHours(), selected.getMinutes());
      setEndDate(newDate);
      setPickerVisible(false);
    }
  };

  const { duration, cost } = calculateDurationAndCost();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 60 }}>
      <Header title="Solicitar préstamo" />

      <View style={styles.content}>
        <Text style={styles.label}>Seleccionar estación de origen</Text>
        {loadingStations ? (
          <ActivityIndicator size="large" color="#3b7d3c" style={{ marginTop: 10 }} />
        ) : (
          stations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.option, origin?.id === item.id && styles.selectedOption]}
              onPress={() => handleSelectOrigin(item)}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        )}

        {origin && (
          <>
            <Text style={styles.subLabel}>Vehiculo seleccionado:</Text>
            <TouchableOpacity
              style={styles.selectVehicleBtn}
              onPress={() => setVehicleModalVisible(true)}
            >
              <Text style={styles.selectVehicleText}>
                {selectedVehicle
                  ? `${selectedVehicle.marca} ${selectedVehicle.modelo}`
                  : "Seleccionar vehículo disponible"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {selectedVehicle && (
          <>
            <Text style={styles.label}>Seleccionar estación destino</Text>
            {stations
              .filter((s) => s.id !== origin?.id)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.option, destination?.id === item.id && styles.selectedOption]}
                  onPress={() => handleSelectDestination(item)}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
          </>
        )}

        {destination && (
          <>
            <Text style={styles.label}>Fechas y horas</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => openPicker("inicio")}>
              <Text style={styles.dateText}>Inicio: {startDate.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => openPicker("fin")}>
              <Text style={styles.dateText}>Fin: {endDate.toLocaleString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.showSummaryButton}
              onPress={() => setSummaryVisible(true)}
            >
              <Text style={styles.showSummaryText}>Ver resumen</Text>
            </TouchableOpacity>
          </>
        )}

        {summaryVisible && selectedVehicle && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumen del préstamo</Text>
            <Text style={styles.summaryItem}>Cliente: {currentUser?.name ?? "Desconocido"}</Text>
            <Text style={styles.summaryItem}>Origen: {origin?.name}</Text>
            <Text style={styles.summaryItem}>Destino: {destination?.name}</Text>
            <Text style={styles.summaryItem}>
              Vehículo: {selectedVehicle?.marca} {selectedVehicle?.modelo}
            </Text>
            <Text style={styles.summaryItem}>Inicio: {startDate.toLocaleString()}</Text>
            <Text style={styles.summaryItem}>Fin: {endDate.toLocaleString()}</Text>
            <Text style={styles.summaryItem}>Duración (hrs): {duration}</Text>
            <Text style={styles.summaryItem}>Costo total: ${cost}</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirmar préstamo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <SelectVehicleModal
        visible={vehicleModalVisible}
        onClose={() => setVehicleModalVisible(false)}
        onSelect={handleSelectVehicle}
        stationId={origin?.id ?? null}
      />

      {pickerVisible && (
        <DateTimePicker
          value={pickerMode.includes("inicio") ? startDate : endDate}
          mode={pickerMode.includes("Fecha") ? "date" : "time"}
          display="default"
          onChange={onPickerChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  content: {
    flex: 1,
    padding: 18,
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 6,
    marginTop: 12,
  },
  subLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1b4332",
    marginBottom: 8,
    marginTop: 12,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#b7e4c7",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 6,
  },
  selectedOption: {
    backgroundColor: "#95d5b2",
    borderColor: "#52b788",
  },
  optionText: {
    fontSize: 15,
    color: "#081c15",
    
  },
  selectVehicleBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#b7e4c7",
    alignItems: "center",
    marginTop: 6,
  },
  selectVehicleText: {
    color: "#2d6a4f",
    fontWeight: "600",
  },
  dateButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#b7e4c7",
    marginBottom: 8,
  },
  dateText: {
    color: "#1b4332",
    fontWeight: "500",
  },
  showSummaryButton: {
    backgroundColor: "#2d6a4f",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  showSummaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  summary: {
    marginTop: 15,
    backgroundColor: "#e9f5ec",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#1b4332",
    fontSize: 16,
  },
  summaryItem: {
    color: "#081c15",
    fontSize: 14,
    marginVertical: 1,
  },
  confirmButton: {
    marginTop: 12,
    backgroundColor: "#40916c",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
