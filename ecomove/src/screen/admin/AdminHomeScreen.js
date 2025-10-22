import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

export default function AdminHomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = () => {
    setMenuVisible(false);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administrador</Text>
        <TouchableOpacity
          onPress={toggleMenu}
          style={styles.profileButton}
          accessibilityLabel="Abrir menú de perfil"
        >
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("StationScreen")}
        >
          <Text style={styles.buttonText}>Gestionar Estaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("VehicleScreen")}
        >
          <Text style={styles.buttonText}>Gestionar Vehículos</Text>
        </TouchableOpacity>
      </View>

      {/* MENÚ DESPLEGABLE */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          />
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Admin</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8f5e9" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2e7d32",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  profileButton: {
    backgroundColor: "#fff",
    borderRadius: 50, 
    padding: 8,
  },
  profileText: { fontSize: 18 },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, 
  },
  menu: {
    backgroundColor: "#fff",
    marginTop: 50,
    marginRight: 10,
    borderRadius: 8,
    padding: 10,
    minWidth: 180,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  menuItem: { paddingVertical: 8 },
  menuItemText: { fontSize: 15, color: "#333" },
});
