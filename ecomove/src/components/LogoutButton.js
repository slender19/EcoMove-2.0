// src/screen/components/LogoutButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function LogoutButton({ navigation }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Login")}
    >
      <Text style={styles.text}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-end", // lo manda a la derecha
  },
  text: { color: "white", fontWeight: "bold" },
});
