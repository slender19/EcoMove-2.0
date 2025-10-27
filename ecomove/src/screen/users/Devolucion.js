import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header";
import Iconos from "../../components/Iconos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoanService from "../../services/LoanService";
import ConfirmPaymentModal from "../../components/ConfirmPaymentModal";

export default function DevolucionesScreen({ navigation }) {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPrestamosActivos();
  }, []);

  const loadPrestamosActivos = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (!storedUser) {
        Alert.alert("Error", "No hay usuario en sesión");
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(storedUser);
      const allLoans = await LoanService.getLoansByUserId(currentUser.id);

      if (Array.isArray(allLoans)) {
        const activos = allLoans.filter(
          (prestamo) => prestamo.estado?.toLowerCase() === "activo"
        );
        setPrestamos(activos);
      } else {
        setPrestamos([]);
      }
    } catch (error) {
      console.error("Error al cargar préstamos activos:", error);
      Alert.alert("Error", "No se pudieron cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrestamo = (prestamo) => {
    setSelectedPrestamo(prestamo);
    setShowModal(true);
  };

  const handlePagoExitoso = () => {
    setShowModal(false);
    setSelectedPrestamo(null);
    loadPrestamosActivos();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Cargando devoluciones...</Text>
      </View>
    );
  }

  const renderPrestamo = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Vehiculo:</Text>
      <Text style={styles.cardTitle}>
        {item.vehicle?.marca} {item.vehicle?.modelo}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.label}>Estación Origen:</Text>
      <Text style={styles.value}>{item.estacion_origen || "—"}</Text>

      <Text style={styles.label}>Estación Destino:</Text>
      <Text style={styles.value}>{item.estacion_destino || "—"}</Text>

      <Text style={styles.label}>Fecha y hora de inicio:</Text>
      <Text style={styles.value}>
        {new Date(item.fecha_hora_inicio).toLocaleString("es-CO")}
      </Text>

      {item.fecha_hora_fin && (
        <>
          <Text style={styles.label}>Fecha y hora de fin:</Text>
          <Text style={styles.value}>
            {new Date(item.fecha_hora_fin).toLocaleString("es-CO")}
          </Text>
        </>
      )}

      <Text style={styles.label}>Costo total:</Text>
      <Text style={[styles.value, styles.cost]}>
        ${item.costo_calculado ? item.costo_calculado.toFixed(2) : "0.00"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelectPrestamo(item)}
      >
        <Text style={styles.buttonText}>Confirmar devolución</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Devoluciones" />

      <Text style={styles.subtitle}>Préstamos activos</Text>

      {prestamos.length === 0 ? (
        <Text style={styles.empty}>No tienes préstamos activos.</Text>
      ) : (
        <FlatList
          data={prestamos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPrestamo}
          contentContainerStyle={styles.list}
        />
      )}

      <ConfirmPaymentModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectedLoan={selectedPrestamo}
        onPaymentSuccess={handlePagoExitoso}
      />

      <View style={styles.menu}>
        <Iconos
          nombre="Solicitar"
          icono="car"
          color="#4CAF50"
          onPress={() => navigation.navigate("Solicitar")}
        />
        <Iconos
          nombre="Inicio"
          icono="home"
          color="#2196F3"
          onPress={() => navigation.navigate("HomeScreen")}
        />
        <Iconos
          nombre="Historial"
          icono="history"
          color="#FF9800"
          onPress={() => navigation.navigate("Historial")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: "#f5f7f4", },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#ffffffff",
  },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#388e3c",
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  divider: {
    borderBottomColor: "#c8e6c9",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  cost: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#1b5e20",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fff4",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2e7d32",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
