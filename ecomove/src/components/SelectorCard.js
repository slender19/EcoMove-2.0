import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function SelectorCard({ titulo, data, onSelect, selectedItem, disabledItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo}</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        nestedScrollEnabled={true}
        renderItem={({ item }) => {
          const isSelected = item === selectedItem;
          const isDisabled = item === disabledItem;

          return (
            <TouchableOpacity
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => !isDisabled && onSelect(item)}
              disabled={isDisabled}
            >
              {/* Círculo de selección */}
              <View style={[styles.circle, isSelected && styles.circleSelected]} />
              <Text style={[styles.itemText, isDisabled && styles.disabledText]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: { fontSize: 16, marginLeft: 10 },
  disabledText: { color: "gray" },
  selectedItem: { backgroundColor: "#e0f7e9" },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
  },
  circleSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
});
