import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.name || "Usuario");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };
    loadUser();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      setMenuVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ---------- ENCABEZADO PRINCIPAL ---------- */}
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.slogan}>Cada trayecto cuenta para un futuro mejor</Text>
      </View>

      {/* ---------- SECCIÓN PERFIL ---------- */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={toggleMenu}
          style={styles.profileButton}
          accessibilityLabel="Abrir menú de perfil"
        >
          <Text style={styles.profileIcon}>👤</Text>
          <Text style={styles.profileName}>{userName}</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- MENÚ DESPLEGABLE ---------- */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Mi cuenta</Text>
            <Text style={styles.userLabel}>👋 Hola, {userName}</Text>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // ---------- CABECERA PRINCIPAL ----------
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#e8f5e9",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
  },
  slogan: {
    fontSize: 14,
    color: "#388e3c",
    marginTop: 5,
    textAlign: "center",
    fontStyle: "italic",
  },

  profileSection: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#c8e6c9",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 14,
    elevation: 3,
  },
  profileIcon: {
    color: "#fff",
    fontSize: 18,
    marginRight: 6,
  },
  profileName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // ---------- MENÚ DESPLEGABLE ----------
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  menuContainer: {
    position: "absolute",
    top: 135,
    right: 20,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
  },
  userLabel: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  menuItemText: {
    color: "#d32f2f",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
