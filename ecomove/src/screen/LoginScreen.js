import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AuthService from "../services/AuthService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await AuthService.login(email.trim(), password);

    if (!result.success) {
      Alert.alert("Error de inicio de sesión", result.message);
      return;
    }

    if (result.user.role === "admin") {
      navigation.replace("AdminHome");
    } else {
      navigation.replace("HomeScreen");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ecomove</Text>
      <Text style={styles.subtitle}>Inicia sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.registerText}>
      ¿No tienes cuenta?{" "}
       <Text
        style={{ color: "#2e7d32", fontWeight: "bold" }}
        onPress={() => navigation.replace("Register")}
         >
        Regístrate
        </Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#2e7d32", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20, color: "#555" },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
