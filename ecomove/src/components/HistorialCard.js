import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function HistorialCard({ historial = [] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Historial reciente</Text>
      {historial.length > 0 ? (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.transporte} - {item.tiempo} - ${item.costo}
            </Text>
          )}
        />
      ) : (
        <Text>No tienes historial aún</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e6ffe6", // verde aún más claro
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  item: { fontSize: 16, marginBottom: 5 },
});
