import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { supabase } from "./supabase";

// Función para formatear las fechas en formato 'YYYY-MM-DD'
const formatDate = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`; // Devuelve el formato 'YYYY-MM-DD'
};

export default function ModalReporte({
  modalVisible,
  closeModal,
  formData,
  closeModalAndSent,
}) {
  const [actividades, setActividades] = useState(formData.actividades || "");  // Inicia con formData.actividades
  const [codigoUsuario, setCodigoUsuario] = useState(null);

  // Obtener el usuario logueado cuando el componente se monta
  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        setCodigoUsuario(user.id); // O usa el campo que corresponda a tu caso
      } else {
        console.log('No hay usuario logueado');
      }
    };

    getUser();
  }, []);

  // Función para insertar el reporte en Supabase
  const handleEnviarReporte = async () => {
    try {
      // Verifica que el campo actividades no esté vacío
      console.log("formData:", formData);
      console.log("Actividades:", actividades);

      if (!actividades) {
        alert("Por favor, completa el campo de actividades.");
        return;
      }

      // Verifica que el código de usuario esté presente
      if (!codigoUsuario) {
        alert("El usuario no está autenticado.");
        return;
      }

      // Convertimos las fechas al formato correcto (YYYY-MM-DD)
      const { fechaReporte, periodoInicio, periodoFin } = formData;
      const formattedFechaReporte = formatDate(fechaReporte);
      const formattedPeriodoInicio = formatDate(periodoInicio);
      const formattedPeriodoFin = formatDate(periodoFin);

      // Verifica que las fechas estén correctas
      console.log("formattedFechaReporte:", formattedFechaReporte);
      console.log("formattedPeriodoInicio:", formattedPeriodoInicio);
      console.log("formattedPeriodoFin:", formattedPeriodoFin);

      // Insertar en la tabla 'reportes' en Supabase
      const { data, error } = await supabase
        .from('reportes')
        .insert([
          {
            actividades: actividades,
            periodoInicio: formattedPeriodoInicio,
            codigoUsuario: codigoUsuario,  // Asegúrate de que esto se pasa correctamente
            periodoFin: formattedPeriodoFin,
            fechaReporte: formattedFechaReporte,
          }
        ]);

      // Verifica si hubo un error en la inserción
      if (error) {
        console.error('Error al insertar el reporte:', error);
        alert(`Hubo un error al enviar el reporte: ${JSON.stringify(error)}`);  // Mostrar error detallado
      } else {
        console.log('Reporte enviado con éxito:', data);
        closeModalAndSent();
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Hubo un error al enviar el reporte');
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>Fecha de Reporte: {formData.fechaReporte}</Text>
          <Text style={styles.text}>Horas Reportadas: {formData.horasReportadas}</Text>
          <Text style={styles.text}>Periodo Inicio: {formData.periodoInicio}</Text>
          <Text style={styles.text}>Periodo Fin: {formData.periodoFin}</Text>

          <Text style={styles.text}>Actividades Realizadas:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            value={actividades} // Asegúrate de que 'actividades' está correctamente vinculado al estado
            onChangeText={setActividades} // Actualiza el estado correctamente
            placeholder="Escribe las actividades realizadas..."
          />

          <Pressable onPress={handleEnviarReporte} style={styles.button}>
            <Text style={styles.buttonText}>Enviar Reporte</Text>
          </Pressable>
          <Pressable onPress={closeModal} style={styles.button}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
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
    alignItems: "center",
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
