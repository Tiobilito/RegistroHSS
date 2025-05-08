import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  eliminarReporte,
  obtenerReportesPorUsuario,
} from "../Operaciones Supabase/ReportesSupa";
import { ObtenerDatosUsuario } from "../InfoUsuario";

export default function ModalReporteUsuario({ visible, closeModal }) {
  const [reportes, setReportes] = React.useState(null);

  const fetchReportes = async () => {
    const data = await ObtenerDatosUsuario();
    const reportes = await obtenerReportesPorUsuario(
      parseInt(data.Codigo, 10)
    );
    setReportes(reportes);
  };

  const handleBorrar = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            await eliminarReporte(id);
            await fetchReportes();
            closeModal();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  React.useEffect(() => {
    fetchReportes();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mis Reportes</Text>
            {reportes && reportes.length > 0 ? (
              reportes.map((reporte) => (
                <View key={reporte.id} style={styles.reportDetailsContainer}>
                  <Text style={styles.reportText}>
                    Fecha Reporte: {reporte.FechaReporte}
                  </Text>
                  <Text style={styles.reportText}>
                    Periodo Inicio: {reporte.PeriodoInicio}
                  </Text>
                  <Text style={styles.reportText}>
                    Periodo Fin: {reporte.PeriodoFin}
                  </Text>
                  <Text style={styles.reportText}>
                    Actividades Realizadas: {reporte.Actividades}
                  </Text>
                  <Pressable
                    onPress={() => handleBorrar(reporte.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={32} color="red" />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.reportText}>
                No tienes reportes disponibles.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "85%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalContent: {
    maxHeight: "75%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2272A7",
    textAlign: "center",
    marginBottom: 20,
  },
  reportDetailsContainer: {
    backgroundColor: "#F5F9FF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2272A7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reportText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#2272A7",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

