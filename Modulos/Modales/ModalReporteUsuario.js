import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eliminarReporte } from "../Operaciones Supabase/ReportesSupa";

export default function ModalReporteUsuario({ visible, closeModal, reportes }) {
  //console.log("Reportes en el modal:", reportes); // Verifica si los reportes están llegando al modal

  const handleBorrar = async (id) => {
    await eliminarReporte(id);
    closeModal();
  };

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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%", // Limitar la altura del modal
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
