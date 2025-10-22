import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import Header from "../../components/header";
import NavigationMenu from "../../components/NavigationMenu";
import SelectorCard from "../../components/SelectorCard";
import { HistorialContext } from "../../components/HistorialContext";
import LogoutButton from "../../components/LogoutButton";
import { Button } from "react-native";

export default function Solicitar({ navigation }) {
  const estaciones = ["Times Square", "Central Park", "Brooklyn", "Queens", "Bronx"];
  const transportes = ["Scooter", "Bicicleta", "Moto"];

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [transporte, setTransporte] = useState(null);

  const { agregarViaje } = useContext(HistorialContext);



  const calcularDistancia = () => {
    if (origen && destino) {
      return Math.floor(Math.random() * 10 + 1) + " km";
    }
    return "N/A";
  };

  const calcularCosto = () => {
    if (transporte) {
      if (transporte === "Scooter") return "$5";
      if (transporte === "Bicicleta") return "$3";
      if (transporte === "Moto") return "$7";
    }
    return "N/A";
  };

  const aceptarViaje = () => {
  // valida que exista origen/destino/transporte
  if (!origen || !destino || !transporte) {
    Alert.alert("Error", "Por favor selecciona origen, destino y transporte.");
    return;
  }

  const viaje = {
    origen,
    destino,
    transporte, 
    distancia: calcularDistancia(),
    costo: calcularCosto(),
    fecha: new Date().toLocaleString(),
  };

  
  agregarViaje(viaje);

  
  Alert.alert("Ruta guardada", "La ruta fue agregada al historial.");

  // limpiar la selección para que el usuario pueda elegir otra vez
  setOrigen(null);
  setDestino(null);
  setTransporte(null);
};




  return (
    <FlatList
      data={[]} 
      ListHeaderComponent={
        <View style={styles.container}>
          <Header title="Ecomove" />

          {/* Menú de navegación dinámico */}
          <NavigationMenu current="Solicitar" navigation={navigation} />

          {/* Selector de Origen */}
          <SelectorCard
            titulo="Estación de origen"
            data={estaciones}
            onSelect={setOrigen}
            selectedItem={origen}
            disabledItem={null}
          />

          {/* Selector de Destino */}
          <SelectorCard
            titulo="Estación de destino"
            data={estaciones}
            onSelect={setDestino}
            selectedItem={destino}
            disabledItem={origen}
          />

          {/* Selector de Transporte */}
          {origen && destino && (
            <SelectorCard
              titulo="Transporte"
              data={transportes}
              onSelect={setTransporte}
              selectedItem={transporte}
              disabledItem={null}
            />
          )}

          {/* Resultados */}
          {origen && destino && transporte && (
            <View style={styles.result}>
              <View style={styles.row}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/684/684908.png" }} // ícono origen
                  style={styles.icon}
                />
                <Text>Origen: {origen}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={{ uri: "data:image/png;base64,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" }} // ícono destino
                  style={styles.icon}
                />
                <Text>Destino: {destino}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={{ uri: "data:image/png;base64,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" }} // ícono distancia
                  style={styles.icon}
                />
                <Text>Distancia: {calcularDistancia()}</Text>
              </View>

              <View style={styles.row}>
                <Image
                  source={{ uri: "data:image/png;base64,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" }} // ícono transporte
                  style={styles.icon}
                />
                <Text>Vehículo: {transporte}</Text>
              </View>

              {/* Valor a pagar centrado */}
              <View style={styles.centerRow}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png" }} // ícono dinero
                  style={styles.icon}
                />
                <Text style={styles.paymentText}>Valor a pagar: {calcularCosto()}</Text>
              </View>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                  {/* Botón Aceptar */}
                  <TouchableOpacity
                    onPress={aceptarViaje}
                    style={{
                      backgroundColor: "green",
                      padding: 12,
                      borderRadius: 8,
                      marginTop: 20,
                    }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Aceptar</Text>
                  </TouchableOpacity>

                </View>
            </View>
          )}


          {/* Botón de cerrar sesión reutilizable */}
          <LogoutButton navigation={navigation} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#d0f5d9", padding: 20 },
  
  result: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
    resizeMode: "contain",
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  paymentText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});
