import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground, Modal, ScrollView } from "react-native";
import { Ionicons } from "react-native-vector-icons"; // Importamos los iconos

import { obtenerReportes } from "../Modulos/Operaciones Supabase/ReportesSupa";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

const scaleFactor = 1;

export default function Reportes({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const image = require("../assets/Back.png"); 

  useEffect(() => {
    const fetchReportes = async () => {
      const Udata = await ObtenerDatosUsuario();
      const data = await obtenerReportes(Udata.idDepartamento); 
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
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "black",
    marginTop: 80,
  },
  reportListContainer: {
    flex: 1,
    marginTop: 10,
  },
  reportInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "black",
  },
  userIcon: {
    marginRight: 12,
    color: "#2272A7",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "85%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContent: {
    maxHeight: "75%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  reportDetailsContainer: {
    backgroundColor: "#F5F9FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2272A7",
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
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
