import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView } from "react-native";
import { ObtenerDatosUsuario } from "../InfoUsuario";
import { insertarReporte } from "../Operaciones Supabase/ReportesSupa";
import { Dimensions } from "react-native";

const formatDate = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`; 
};
const { height } = Dimensions.get("window"); // Obtener altura de la pantalla

export default function ModalReporte({
  modalVisible,
  closeModal,
  formData,
}) {
  const [actividades, setActividades] = useState(formData.actividades || "");
  const [usuario, setUsuario] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await ObtenerDatosUsuario();
      setUsuario(user);
    };
    getUser();
  }, []);

  const handleEnviarReporte = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!actividades) {
        alert("Por favor, completa el campo de actividades.");
        setIsSubmitting(false);
        return;
      }

      const { fechaReporte, periodoInicio, periodoFin } = formData;
      const formattedFechaReporte = formatDate(fechaReporte);
      const formattedPeriodoInicio = formatDate(periodoInicio);
      const formattedPeriodoFin = formatDate(periodoFin);

      const nuevoReporte = {
        Actividades: actividades,
        PeriodoInicio: formattedPeriodoInicio,
        CodigoUsuario: usuario.Codigo,
        PeriodoFin: formattedPeriodoFin,
        FechaReporte: formattedFechaReporte,
      };

      await insertarReporte(nuevoReporte);
      setActividades("");
      closeModal();
    } catch (error) {
      alert(`Hubo un error al enviar el reporte: ${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
          >
            <Text style={styles.text}>Fecha de Reporte: {formData.fechaReporte}</Text>
            <Text style={styles.text}>Horas Reportadas: {formData.horasReportadas}</Text>
            <Text style={styles.text}>Periodo Inicio: {formData.periodoInicio}</Text>
            <Text style={styles.text}>Periodo Fin: {formData.periodoFin}</Text>

            <Text style={styles.text}>Actividades Realizadas:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={actividades} 
              onChangeText={setActividades} 
              placeholder="Escribe las actividades realizadas..."
            />

            <Pressable onPress={handleEnviarReporte} style={styles.button} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{ isSubmitting ? "Enviando..." : "Enviar Reporte" }</Text>
            </Pressable>
            <Pressable onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    minHeight: height * 0.4,  // Al menos 40% del alto de la pantalla
    maxHeight: height * 0.7,  // No más del 70% del alto
    alignSelf: "center",  // Esto asegura que el modal está bien alineado
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  scrollView: {
    flexShrink: 1, // Evita que el contenido expanda demasiado
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2272A7",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "100%",
    height: 100,
    textAlignVertical: "top",
  },
});
