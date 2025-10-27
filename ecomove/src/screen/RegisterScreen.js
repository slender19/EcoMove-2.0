import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Regístrate para empezar a usar Ecomove 
        </Text>

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
            style={styles.loginLink}
            onPress={() => navigation.replace("Login")}
          >
            Inicia sesión
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f4f8fb", // Fondo suave
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2e7d32",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#4f6658",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9e2ec",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: "#455a64",
    textAlign: "center",
  },
  loginLink: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
});
