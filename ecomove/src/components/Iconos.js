import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

export default function Iconos({ nombre, icono, imagen, color, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.imagen} />
      ) : (
        <Icon name={icono} size={40} color={color} />
      )}
      <Text style={styles.text}>{nombre}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  imagen: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 5,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
});
