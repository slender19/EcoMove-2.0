import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SuggestionBubble({ onPress }) {
  return (
    <TouchableOpacity style={styles.bubble} onPress={onPress}>
      <Text style={styles.text}>💡 Sugerencias</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 20,
    elevation: 5,
  },
  text: { color: "#fff", fontWeight: "bold" },
});
