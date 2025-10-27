import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ImagePickerField({ label, imageUri, onChange }) {
  const [preview, setPreview] = useState(
    imageUri ? (typeof imageUri === "string" ? imageUri : imageUri.uri) : null
  );

  useEffect(() => {
    setPreview(imageUri ? (typeof imageUri === "string" ? imageUri : imageUri.uri) : null);
  }, [imageUri]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita acceso a la galería para seleccionar imágenes.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        const ext = uri.split(".").pop()?.split("?")[0] || "jpg";
        const name = asset.fileName || `vehiculo_${Date.now()}.${ext}`;
        const type = asset.mimeType || `image/${ext}`;

        const selectedImage = { uri, name, type };

        console.log("📸 Imagen seleccionada:", selectedImage);

        setPreview(selectedImage.uri);
        onChange && onChange(selectedImage);
      }
    } catch (error) {
      console.error("Error abriendo galería:", error);
      Alert.alert("Error", "No se pudo abrir la galería de imágenes.");
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {preview ? (
          <Image source={{ uri: preview }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={32} color="#777" />
            <Text style={styles.placeholderText}>Seleccionar imagen</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 14,
    color: "#2f3e46",
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#777", marginTop: 8 },
});
