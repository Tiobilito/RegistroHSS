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
    justifyContent: "center", // Esto centra el modal verticalmente
    alignItems: "center", // Esto lo centra horizontalmente
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%", // Ancho del modal
    maxHeight: "80%", // Limitar la altura del modal para evitar que sea demasiado grande
  },
  modalContent: {
    maxHeight: "85%", // Limitar el área de contenido dentro del modal
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  reportDetailsContainer: {
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
  },
  reportText: {
    fontSize: 14,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2272A7",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  deleteButton: {
    left: "85%",
    backgroundColor: "white",
    borderRadius: 200,
    width: "14%",
    top: "1%",
  },
});
