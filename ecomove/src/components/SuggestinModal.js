import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
export default function SuggestionModal({ visible, onClose }) {
  const [vehiculo, setVehiculo] = useState("");
  const [parada, setParada] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleEnviar = () => {
    console.log({ vehiculo, parada, motivo });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Enviar sugerencia</Text>
          <TextInput
            placeholder="Nombre del vehículo"
            style={styles.input}
            value={vehiculo}
            onChangeText={setVehiculo}
          />
          <TextInput
            placeholder="Nombre de la estación"
            style={styles.input}
            value={parada}
            onChangeText={setParada}
          />
          <TextInput
            placeholder="Explica por qué deseas esto"
            style={[styles.input, styles.textArea]}
            value={motivo}
            onChangeText={setMotivo}
            multiline
          />
          <Button title="Enviar" onPress={handleEnviar} />
          <Button title="Cerrar" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#fff",
  },
  textArea: { height: 80 },
});
