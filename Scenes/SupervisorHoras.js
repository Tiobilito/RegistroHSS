import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "react-native-vector-icons";
import { supabase } from "../Modulos/Operaciones Supabase/supabase";

const scaleFactor = 1;
const screenHeight = Dimensions.get("window").height;

export default function SupervisorHoras({ navigation }) {
  const [horasPendientes, setHorasPendientes] = useState([]);
  const [usuariosMap, setUsuariosMap] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [horasUsuario, setHorasUsuario] = useState([]);

  useEffect(() => {
    const cargarHorasPendientes = async () => {
      try {
        const { data, error } = await supabase
          .from("Horas")
          .select("id, Inicio, Final, Total, CodigoUsuario, DateInicio, idReporte, Validada")
          .eq("Validada", false)
          .order("CodigoUsuario", { ascending: true });

        if (error) throw error;
        setHorasPendientes(data || []);
      } catch (err) {
        console.error("Error al obtener las horas pendientes:", err.message);
      }
    };

    const cargarUsuarios = async () => {
      try {
        const { data, error } = await supabase
          .from("Usuarios")
          .select("Codigo, Nombre");

        if (error) throw error;

        // Convertir la lista en un objeto {CodigoUsuario: Nombre}
        const usuariosObj = {};
        data.forEach(({ Codigo, Nombre }) => {
          usuariosObj[Codigo] = Nombre;
        });

        setUsuariosMap(usuariosObj);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err.message);
      }
    };

    cargarHorasPendientes();
    cargarUsuarios();
  }, []);

  const abrirModal = (codigoUsuario) => {
    const horasFiltradas = horasPendientes.filter(hora => hora.CodigoUsuario === codigoUsuario);
    setUsuarioSeleccionado(codigoUsuario);
    setHorasUsuario(horasFiltradas);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
    setHorasUsuario([]);
  };

  const actualizarEstadoHora = async (hora, nuevoEstado) => {
    const validada = nuevoEstado === "Validada";

    try {
      const { error } = await supabase
        .from("Horas")
        .update({ Validada: validada })
        .eq("id", hora.id);

      if (error) throw error;

      setHorasPendientes((prevHoras) => prevHoras.filter((h) => h.id !== hora.id));
      setHorasUsuario((prevHoras) => prevHoras.filter((h) => h.id !== hora.id));

      Alert.alert("Éxito", "El estado de la hora ha sido actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el estado de la hora:", err.message);
      Alert.alert("Error", "No se pudo actualizar el estado de la hora.");
    }
  };

  const image = require("../assets/Back.png");

  return (
    <ImageBackground source={image} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Horas de Prestadores</Text>
        <FlatList
          data={[...new Set(horasPendientes.map(hora => hora.CodigoUsuario))]}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => abrirModal(item)} style={styles.itemContainer}>
              <Ionicons name="person-outline" size={24 * scaleFactor} color="#2272A7" />
              <Text style={styles.itemText}>{usuariosMap[item] || "Desconocido"} - {item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* MODAL PARA VALIDAR HORAS */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Horas de {usuariosMap[usuarioSeleccionado] || "Desconocido"}
            </Text>
            <ScrollView style={styles.scrollView}>
              {horasUsuario.map((hora) => (
                <View key={hora.id} style={styles.horaContainer}>
                  <Text style={styles.modalText}>Inicio: {hora.Inicio}</Text>
                  <Text style={styles.modalText}>Final: {hora.Final}</Text>
                  <Text style={styles.modalText}>Total: {hora.Total} Horas</Text>
                  <View style={styles.pickerContainer}>
                    <Text style={styles.modalText}>Estado:</Text>
                    <Picker
                      selectedValue={hora.Validada ? "Validada" : "Pendiente"}
                      onValueChange={(itemValue) => actualizarEstadoHora(hora, itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Pendiente" value="Pendiente" />
                      <Picker.Item label="Validada" value="Validada" />
                    </Picker>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "black",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  horaContainer: {
    backgroundColor: "#F5F9FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2272A7",
    width: "100%",
  },
  pickerContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
  },
  picker: {
    width: 200,
    height: 50,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#2272A7",
    borderRadius: 10,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
});

