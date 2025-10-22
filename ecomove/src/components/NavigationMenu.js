import React from "react";
import { View, StyleSheet } from "react-native";
import Iconos from "./Iconos";

export default function NavigationMenu({ current, navigation }) {
  const routes = ["Home", "Solicitar", "Devolucion", "Historial"];

  return (
    <View style={styles.menu}>
      {routes
        .filter((route) => route !== current) // no mostramos el actual
        .map((route) => {
          let icon = "circle";
          let color = "#000";

          if (route === "Home") {
            icon = "home";
            color = "#4CAF50";
          } else if (route === "Solicitar") {
            icon = "car";
            color = "#2196F3";
          } else if (route === "Devolucion") {
            icon = "handshake";
            color = "#FF9800";
          } else if (route === "Historial") {
            icon = "history";
            color = "#9C27B0";
          }

          return (
            <Iconos
              key={route}
              nombre={route}
              icono={icon}
              color={color}
              onPress={() => navigation.navigate(route)}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});
