import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { supabase } from "../Operaciones Supabase/supabase";
import { ObtenerDatosUsuario } from "../InfoUsuario";

const formatDate = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`; 
};

export default function ModalReporte({
  modalVisible,
  closeModal,
  formData,
}) {
  const [actividades, setActividades] = useState(formData.actividades || "");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await ObtenerDatosUsuario();
      setUsuario(user);
    };
    getUser();
  }, []);

  // Función para insertar el reporte en Supabase sin añadir horas
  const handleEnviarReporte = async () => {
    try {
      if (!actividades) {
        alert("Por favor, completa el campo de actividades.");
        return;
      }

      const { fechaReporte, periodoInicio, periodoFin } = formData;
      const formattedFechaReporte = formatDate(fechaReporte);
      const formattedPeriodoInicio = formatDate(periodoInicio);
      const formattedPeriodoFin = formatDate(periodoFin);

      const { data, error } = await supabase
        .from('Reportes')
        .insert([
          {
            Actividades: actividades,
            PeriodoInicio: formattedPeriodoInicio,
            CodigoUsuario: usuario.Codigo,
            PeriodoFin: formattedPeriodoFin,
            FechaReporte: formattedFechaReporte,
          }
        ]);

      if (error) {
        console.error('Error al insertar el reporte:', error);
        alert(`Hubo un error al enviar el reporte: ${JSON.stringify(error)}`);
      } else {
        console.log('Reporte enviado con éxito:', data);
        // Limpiar el campo de actividades y cerrar el modal
        setActividades("");
        closeModal();
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
            value={actividades} 
            onChangeText={setActividades} 
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
