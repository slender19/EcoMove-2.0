import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../../components/header";
import Iconos from "../../components/Iconos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoanService from "../../services/LoanService";

export default function Historial({ navigation }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (!storedUser) {
          console.warn("No hay usuario en sesión");
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(storedUser);
        const allLoans = await LoanService.getLoansByUserId(currentUser.id);

        if (Array.isArray(allLoans)) {
          const sorted = allLoans.sort(
            (a, b) => new Date(b.fecha_hora_inicio) - new Date(a.fecha_hora_inicio)
          );
          setHistorial(sorted);
        } else {
          console.warn("El servicio no devolvió un array:", allLoans);
          setHistorial([]);
        }
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Historial" />

      <Text style={styles.subtitle}>Navegación</Text>
      <View style={styles.menu}>
        <Iconos
          nombre="Solicitar"
          icono="car"
          color="#4CAF50"
          onPress={() => navigation.navigate("Solicitar")}
        />
        <Iconos
          nombre="Devolución"
          icono="undo"
          color="#2196F3"
          onPress={() => navigation.navigate("Devolucion")}
        />
        <Iconos
          nombre="Inicio"
          icono="home"
          color="#FFB300"
          onPress={() => navigation.navigate("HomeScreen")}
        />
      </View>

      {historial.length === 0 ? (
        <Text style={styles.empty}>Aún no tienes viajes registrados.</Text>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Encabezado con estado a la derecha */}
              <View style={styles.cardHeader}>
                <Text style={styles.label}>Estación origen:</Text>
                <Text
                  style={[
                    styles.estadoText,
                    item.estado === "activo"
                      ? styles.activeStatus
                      : styles.inactiveStatus,
                  ]}
                >
                  {item.estado === "activo" ? "Activo" : "Inactivo"}
                </Text>
              </View>
              <Text style={styles.value}>{item.estacion_origen || "—"}</Text>

              <Text style={styles.label}>Estación destino:</Text>
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

              {item.duracion && (
                <>
                  <Text style={styles.label}>Duración:</Text>
                  <Text style={styles.value}>
                    {item.duracion} hora(s)
                  </Text>
                </>
              )}

              <Text style={styles.label}>Costo total:</Text>
              <Text style={[styles.value, styles.cost]}>
                ${item.costo_calculado ? item.costo_calculado.toFixed(2) : "0.00"}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.label}>Vehículo:</Text>
              <Text style={styles.label}>Marca:</Text>
              <Text style={styles.value}> {item.vehicle?.marca || "No disponible"} </Text>
              <Text style={styles.label}>Modelo:</Text>
              <Text style={styles.value}> {item.vehicle?.modelo || "No disponible"} </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f4",
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#2e7d32",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e7d32",
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    color: "#424242",
    marginLeft: 4,
  },
  estadoText: {
    fontSize: 15,
    fontWeight: "700",
  },
  cost: {
    fontWeight: "bold",
    color: "#1b5e20",
  },
  divider: {
    borderBottomColor: "#c8e6c9",
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9f7ef",
  },
  loadingText: {
    marginTop: 10,
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "500",
  },
  activeStatus: {
    color: "#2e7d32",
  },
  inactiveStatus: {
    color: "#c62828",
  },
});
