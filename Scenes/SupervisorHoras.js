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
    marginTop: 100,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fcfcfc",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 0.8,
    padding: 10,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: screenHeight * 0.8,
    alignItems: "center",
  },
  horaContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  pickerContainer: {
    alignItems: "center",
    marginTop: 15,
    padding: 5,
  },
  picker: {
    width: 200,
    height: 50,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#2272A7",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
