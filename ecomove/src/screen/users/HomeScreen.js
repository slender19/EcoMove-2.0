import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; 
import Header from "../../components/header";
import HistorialCard from "../../components/HistorialCard";
import SuggestionBubble from "../../components/SuggestionBubble";
import SuggestionModal from "../../components/SuggestinModal";
import Iconos from "../../components/Iconos";

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header title="Ecomove" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            nombre="Historial"
            icono="history"
            color="#FF9800"
            onPress={() => navigation.navigate("Historial")}
          />
        </View>

        <View style={styles.historialSection}>
          <HistorialCard key={refreshKey} />
        </View>
      </ScrollView>

      <SuggestionBubble onPress={() => setModalVisible(true)} />
      <SuggestionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8f8f8ff",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  historialSection: {
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 25,
    borderRadius: 15,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
