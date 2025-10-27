import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../services/AuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const result = await AuthService.login(email, password);
    setLoading(false);

    if (result.success) {
      try {
        await AsyncStorage.setItem("currentUser", JSON.stringify(result.user));
        Alert.alert("Bienvenido", `Hola ${result.user.name || "Usuario"} 👋`);

        if (result.user.role === "admin") {
          navigation.replace("AdminHome");
        } else {
          navigation.replace("HomeScreen");
        }
      } catch (error) {
        console.error("Error guardando usuario:", error);
        Alert.alert("Error", "Hubo un problema al guardar la sesión.");
      }
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Ingresar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.link}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8f5", 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cfd8dc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#555",
    textAlign: "center",
    marginTop: 15,
  },
  link: {
    color: "#1b5e20",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
