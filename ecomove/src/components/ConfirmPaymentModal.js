import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import FacturaService from "../services/FacturaService";

export default function ConfirmPaymentModal({
  visible,
  onClose,
  selectedLoan,
  onPaymentSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const handleConfirmPayment = async () => {
    if (!selectedLoan) return;
    setLoading(true);

    try {
      const facturaData = {
        monto: selectedLoan.costo_calculado,
        metodo: "efectivo",
        estado_pago: "pagado",
        prestamo: selectedLoan.id,
      };

      const facturaCreada = await FacturaService.createFactura(
        facturaData.monto,
        facturaData.metodo,
        facturaData.estado_pago,
        facturaData.prestamo
      );

      if (!facturaCreada.success) {
        throw new Error(facturaCreada.message || "Error al crear la factura");
      }

      setInvoice(facturaCreada.factura || facturaCreada);
    } catch (error) {
      console.error(
        "Error al confirmar el pago:",
        error.response?.data || error.message || error
      );

      Alert.alert(
        "Error",
        `No se pudo registrar el pago: ${
          JSON.stringify(error.response?.data) || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseInvoice = () => {
    setInvoice(null);
    Alert.alert("✅ Pago confirmado", "Factura generada correctamente.");
    onPaymentSuccess();
    onClose();
  };

  
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("es-CO");
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {invoice ? (
            <>
              <Text style={styles.title}>🧾 Factura de Pago</Text>

              <View style={styles.facturaBox}>
                <Text style={styles.facturaTitle}>Detalles de la Factura</Text>
                <Text style={styles.facturaText}>
                  Monto: ${invoice.monto?.toFixed(2)}
                </Text>
                <Text style={styles.facturaText}>
                  Método: {invoice.metodo}
                </Text>
                <Text style={styles.facturaText}>
                  Estado: {invoice.estado_pago}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.facturaTitle}>Detalles del Préstamo</Text>
                <Text style={styles.facturaText}>
                  Origen: {selectedLoan?.estacion_origen || "—"}
                </Text>
                <Text style={styles.facturaText}>
                  Destino: {selectedLoan?.estacion_destino || "—"}
                </Text>
                <Text style={styles.facturaText}>
                  Inicio: {formatDate(selectedLoan?.fecha_hora_inicio)}
                </Text>
                <Text style={styles.facturaText}>
                  Fin: {formatDate(selectedLoan?.fecha_hora_fin)}
                </Text>
                <Text style={styles.facturaText}>
                  Vehículo:{" "}
                  {selectedLoan?.vehicle?.marca
                    ? `${selectedLoan.vehicle.marca} ${selectedLoan.vehicle.modelo}`
                    : "No disponible"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.okButton}
                onPress={handleCloseInvoice}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Confirmar Pago</Text>
              <Text style={styles.label}>
                ¿Deseas confirmar el pago del préstamo #{selectedLoan?.id}?
              </Text>
              <Text style={styles.detail}>
                Costo total: ${selectedLoan?.costo_calculado?.toFixed(2)}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirmPayment}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Procesando..." : "Confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#bbb",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  facturaBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  facturaTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2e7d32",
  },
  facturaText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  okButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
  },
  okButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
