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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!name || !cedula || !email || !password || !confirm) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const result = await AuthService.register(
        name.trim(),
        cedula.trim(),
        email.trim(),
        password
      );

      if (!result.success) {
        Alert.alert("Error", result.message);
        return;
      }

      Alert.alert("Éxito", "Usuario registrado correctamente", [
        { text: "Ir al login", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar el usuario");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro en Ecomove</Text>

      <TextInput
        placeholder="Nombre completo"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Cédula"
        style={styles.input}
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
      />

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

      <TextInput
        placeholder="Confirmar contraseña"
        style={styles.input}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        ¿Ya tienes cuenta?{" "}
        <Text
          style={{ color: "#2e7d32", fontWeight: "bold" }}
          onPress={() => navigation.replace("Login")}
        >
          Inicia sesión
        </Text>
      </Text>
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
  title: { fontSize: 28, fontWeight: "bold", color: "#2e7d32", marginBottom: 20 },
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
  loginText: { marginTop: 15, fontSize: 14, color: "#555" },
});
