import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, Modal, ScrollView } from "react-native";
import { Ionicons } from "react-native-vector-icons"; // Importamos los iconos

import { obtenerReportes } from "../Modulos/Operaciones Supabase/ReportesSupa"; // Aquí debes agregar tu función para obtener los reportes

const scaleFactor = 1; // Ajusta este valor de acuerdo a tu escala, si es necesario

export default function Reportes({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null); // Estado para el usuario seleccionado
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar el modal

  const image = require("../assets/Back.png"); // Ruta de la imagen de fondo

  // Cargar los reportes
  useEffect(() => {
    const fetchReportes = async () => {
      const data = await obtenerReportes(); // Obtener todos los reportes, sin filtrar por el estudiante logueado
      setReportes(data);
    };

    fetchReportes();
  }, []);

  // Agrupar reportes por el código del usuario y agregar el nombre
  const groupedReportes = reportes.reduce((acc, reporte) => {
    if (!acc[reporte.CodigoUsuario]) {
      acc[reporte.CodigoUsuario] = [];
    }
    // Asegurarse de que el reporte tenga un nombre
    const nombreEstudiante = reporte.NombreEstudiante || "Nombre no disponible";
    acc[reporte.CodigoUsuario].push({ ...reporte, NombreEstudiante: nombreEstudiante });
    return acc;
  }, {});

  // Función para manejar el clic en un reporte
  const handleSelectUsuario = (codigoUsuario) => {
    setSelectedUsuario(codigoUsuario);
    setModalVisible(true); // Mostrar el modal
  };

  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reportes de Prestadores</Text>

        {/* Listado de usuarios con reportes */}
        <View style={styles.reportListContainer}>
          <FlatList
            data={Object.keys(groupedReportes)} // Listar los códigos de usuarios
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleSelectUsuario(item)}>
                  <View style={styles.reportInfoContainer}>
                    {/* Icono de usuario a la izquierda */}
                    <Ionicons
                      name="person-outline"
                      size={24 * scaleFactor} // Tamaño del icono basado en la escala
                      color="#2272A7" // Color azul especificado
                      style={styles.userIcon}
                    />
                    {/* Mostrar nombre y código */}
                    <Text style={styles.text}>
                      {groupedReportes[item][0]?.NombreEstudiante} - {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Modal con los reportes de un usuario */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                {/* Obtener el nombre del estudiante usando el selectedUsuario */}
                <Text style={styles.modalTitle}>
                  Reportes de Usuario: {selectedUsuario} 
                  {" - "}
                  {groupedReportes[selectedUsuario]?.[0]?.NombreEstudiante || "Nombre no disponible"} {/* Mostrar nombre del estudiante */}
                </Text>
                {groupedReportes[selectedUsuario]?.map((reporte) => (
                  <View key={reporte.id} style={styles.reportDetailsContainer}>
                    <Text style={styles.reportText}>Nombre Estudiante: {reporte.NombreEstudiante}</Text>
                    <Text style={styles.reportText}>Código Usuario: {reporte.CodigoUsuario}</Text>
                    <Text style={styles.reportText}>Fecha Reporte: {reporte.FechaReporte}</Text>
                    <Text style={styles.reportText}>Periodo Inicio: {reporte.PeriodoInicio}</Text>
                    <Text style={styles.reportText}>Periodo Fin: {reporte.PeriodoFin}</Text>
                    <Text style={styles.reportText}>Actividades Realizadas: {reporte.Actividades}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 30,
    width: "95%",
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 80,
  },
  reportListContainer: {
    flex: 1,
    maxHeight: "50%", // Limitar la altura máxima del contenedor de la lista
    width: "100%",
  },
  reportInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fcfcfc",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.8,
    padding: 10,
  },
  userIcon: {
    marginRight: 10, // Espacio entre el icono y el texto
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Centrar el texto
  },
  reportDetailsContainer: {
    marginLeft: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  reportText: {
    fontSize: 14,
    color: "#333",
  },
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
    maxHeight: "100%", // Limitar la altura máxima del modal
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
});
