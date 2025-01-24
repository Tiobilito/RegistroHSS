import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { añadirHoraModal, obtenerHorasUsuario, sumarTiempos } from "../Modulos/db";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import ModalFormulario from "../Modulos/ModalFormularioHoras";

const Scale = Dimensions.get("window").width;

export default function PaginaTablaSemanas({ navigation }) {
  const [modalVisible, DetModalVisible] = useState(false);
  const [Horas, DefHoras] = useState([]);
  const [Semanas, DefSemanas] = useState([]);
  const [MostrarSemanas, DefMostrarSemanas] = useState(false);
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);
  const [formData, setFormData] = useState({
    entryHours: "",
    entryMinutes: "",
    entrySeconds: "",
    exitHours: "",
    exitMinutes: "",
    exitSeconds: "",
    day: "",
    month: "",
    year: "",
  });

  // Función para construir una fecha a partir de los valores del formulario
  const construirFecha = (day, month, year, hours, minutes, seconds) => {
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  const openModal = () => {
    DetModalVisible(true);
  };

  const closeModal = () => {
    DetModalVisible(false);
    setFormData({
      entryHours: "",
      entryMinutes: "",
      entrySeconds: "",
      exitHours: "",
      exitMinutes: "",
      exitSeconds: "",
      date: new Date(),
    }); // Restablecer el formulario al cerrar
  };

  const closeModalAndSent = async () => {
    DetModalVisible(false);
    console.log(formData);
    const {
      day,
      month,
      year,
      entryHours,
      entryMinutes,
      entrySeconds,
      exitHours,
      exitMinutes,
      exitSeconds,
    } = formData;
    // Construye las fechas de entrada y salida
    const fechaEntrada = construirFecha(
      day,
      month,
      year,
      entryHours,
      entryMinutes,
      entrySeconds
    );
    const fechaSalida = construirFecha(
      day,
      month,
      year,
      exitHours,
      exitMinutes,
      exitSeconds
    );
    await añadirHoraModal(fechaEntrada, fechaSalida);
    setFormData({
      entryHours: "",
      entryMinutes: "",
      entrySeconds: "",
      exitHours: "",
      exitMinutes: "",
      exitSeconds: "",
      date: new Date(),
    }); // Restablecer el formulario al cerrar
  };

  const obtenerHoras = async () => {
    const HorasSemana = await obtenerHorasUsuario();
    console.log("Horas: ", HorasSemana);
    DefHoras(HorasSemana);
  };

  const obtenerSemanas = async () => {
    const SemanasBD = await obtenerSemanas();
    console.log("Semanas: ", SemanasBD);
    DefSemanas(Semanas);
    DefMostrarSemanas(Semanas.length > 0);
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerSemanas();
      obtenerHoras();
    }, [])
  );

  const handleCheckboxChange = (idSem) => {
    setSemanasSeleccionadas((prevSeleccionadas) =>
      prevSeleccionadas.includes(idSem)
        ? prevSeleccionadas.filter((id) => id !== idSem)
        : [...prevSeleccionadas, idSem]
    );
  };

  const calcularTotalSeleccionado = () => {
    const horasSeleccionadas = Horas.filter((hora) =>
      semanasSeleccionadas.includes(hora.idSemana)
    );
    return sumarTiempos(horasSeleccionadas.map((item) => item.Total));
  };

  const image = require("../assets/fondo.webp");

  return (
    <ImageBackground source={image} style={styles.container}>
      <View
        style={{
          width: "90%",
          marginTop: "8%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "bold" }}>
          Tabla de semanas
        </Text>
        {/* Botón Refresh */}
      </View>
      <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "regular" }}>
        Horas formato de total HH:MM:SS
      </Text>
      <View style={styles.listContainer}>
        <Pressable
          style={{ marginTop: -5, marginBottom: 15 }}
          onPress={() => setSemanasSeleccionadas([])} // Deselecciona todo
          disabled={semanasSeleccionadas.length === 0} // Deshabilita si no hay seleccionadas
        >
          <Ionicons
            name="refresh-circle"
            size={50}
            color={semanasSeleccionadas.length === 0 ? "gray" : "black"} // Color gris si está deshabilitado
          />
        </Pressable>
        <Text style={{ marginLeft: 60, marginTop: -50, fontSize: 14 }}>
          Fecha de inicio - Fecha de fin
        </Text>
        <Pressable
          style={{ marginTop: -35, marginLeft: 245 }}
          onPress={openModal} // Deselecciona todo
        >
          <Ionicons name="add-circle" size={50} />
        </Pressable>
        <ModalFormulario
          modalVisible={modalVisible}
          closeModal={closeModal}
          closeModalAndSent={closeModalAndSent}
          formData={formData}
          setFormData={setFormData}
          handleDateChange={(field, value) => handleDateChange(field, value)}
          handleTimeChange={(field, value) => handleTimeChange(field, value)}
        />
        {MostrarSemanas ? (
          <>
            <View style={{ marginBottom: 20 }} />
            <FlatList
              data={Semanas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Checkbox
                    value={semanasSeleccionadas.includes(item.id)}
                    onValueChange={() => handleCheckboxChange(item.id)}
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "white",
                      borderRadius: 10,
                    }}
                  />
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TablaHoras", {
                        idSem: item.id,
                      });
                    }}
                  >
                    <Text style={styles.txt}>
                      {"    "}
                      {item.Inicio} - {item.Fin}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", width: "auto" }}>
                Total acumulado: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  width: "auto",
                  marginTop: 10,
                }}
              >
                Total de horas seleccionadas: ( {calcularTotalSeleccionado()} )
              </Text>
            </View>
          </>
        ) : (
          <Text>No hay registros</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  txtMain: {
    color: "white",
    fontWeight: "bold",
  },
  txt: {
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  item: {
    backgroundColor: "#2272A7",
    borderRadius: 15,
    marginBottom: "8%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "70%",
    borderRadius: 20,
    marginTop: "8%",
    padding: "4%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
