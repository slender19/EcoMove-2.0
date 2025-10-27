import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoanService from "../services/LoanService";

export default function HistorialCard() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(storedUser);
        const allLoans = await LoanService.getLoansByUserId(currentUser.id);

        if (Array.isArray(allLoans)) {
          const recent = allLoans
            .sort(
              (a, b) =>
                new Date(b.fecha_hora_inicio) - new Date(a.fecha_hora_inicio)
            )
            .slice(0, 4);

          setHistorial(recent);
        } else {
          console.warn("El servicio no devolvió un array:", allLoans);
          setHistorial([]);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
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
        <ActivityIndicator size="small" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Historial reciente</Text>

      {historial.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 5 }}
        >
          {historial.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.itemLeft}>
                <Text style={styles.transporte}>
                  {item.vehicle?.marca?.trim() || "—"}{" "}
                  {item.vehicle?.modelo?.trim() || ""}
                </Text>
                <Text style={styles.tiempo}>
                  {item.estacion_origen} → {item.estacion_destino}
                </Text>
                <Text style={styles.fecha}>
                  {new Date(item.fecha_hora_inicio).toLocaleString()} -{" "}
                  {item.fecha_hora_fin
                    ? new Date(item.fecha_hora_fin).toLocaleString()
                    : "En curso"}
                </Text>
              </View>
              <Text style={styles.costo}>
                ${item.costo_calculado ? item.costo_calculado.toFixed(2) : "0.00"}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No tienes historial aún</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2E7D32",
    marginBottom: 14,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "column",
    marginRight: 10,
  },
  transporte: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
  },
  tiempo: {
    fontSize: 13,
    color: "#388E3C",
  },
  fecha: {
    fontSize: 12,
    color: "#4CAF50",
  },
  costo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#33691E",
  },
  emptyText: {
    textAlign: "center",
    color: "#757575",
    fontSize: 15,
    paddingVertical: 10,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 15,
  },
  loadingText: {
    color: "#2E7D32",
    fontSize: 14,
    marginTop: 6,
  },
});
