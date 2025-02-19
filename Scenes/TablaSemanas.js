import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import ModalFormulario from "../Modulos/ModalFormularioHoras";
import ModalReporte from "../Modulos/ModalReporte";  // Importamos el nuevo modal
import {
  añadirHoraModal,
  obtenerHorasUsuario,
  obtenerSemanasUsuario,
  sumarTiempos,
} from "../Modulos/Base de Datos Sqlite/db";

export default function PaginaTablaSemanas({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  const [modalVisible, DetModalVisible] = useState(false);
  const [modalReporteVisible, DetModalReporteVisible] = useState(false); // Nuevo estado para el modal de reporte
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
    fechaReporte: "",
    horasReportadas: "",
    periodoInicio: "",
    periodoFin: "",
    descripcion: "",  // Añadimos la propiedad descripcion
  });

  // Función para actualizar la descripción
  const handleDescripcionChange = (text) => {
    setFormData({
      ...formData,
      descripcion: text,  // Actualizamos la propiedad descripcion
    });
  };
  // Función para construir una fecha a partir de los valores del formulario
  const construirFecha = (day, month, year, hours, minutes, seconds) => {
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  // Función para obtener el periodo de las semanas seleccionadas
  const obtenerPeriodo = () => {
    if (semanasSeleccionadas.length === 0) return { periodoInicio: "", periodoFin: "" };
    
    const semanasSeleccionadasData = Semanas.filter((semana) =>
      semanasSeleccionadas.includes(semana.id)
    );

    semanasSeleccionadasData.sort((a, b) => new Date(a.Inicio) - new Date(b.Inicio));

    const periodoInicio = semanasSeleccionadasData[0].Inicio;
    const periodoFin = semanasSeleccionadasData[semanasSeleccionadasData.length - 1].Fin;

    return { periodoInicio, periodoFin };
  };

  // Abrir modal para el formulario de horas
  const openModal = () => {
    DetModalVisible(true);
  };

  // Abrir modal para el reporte de semanas seleccionadas
  const openModalReporte = () => {
    const { periodoInicio, periodoFin } = obtenerPeriodo();
    const horasReportadas = calcularTotalSeleccionado();  // Calcula las horas reportadas

    setFormData({
      ...formData,
      fechaReporte: new Date().toLocaleDateString(),
      horasReportadas: horasReportadas,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin,
    });

    DetModalReporteVisible(true);
  };

  // Cerrar el modal de horas
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
    });
  };

  // Cerrar y enviar el reporte
  const closeModalAndSent = async () => {
    DetModalReporteVisible(false);
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
    });
  };

  // Obtener horas de usuario
  const obtenerHoras = async () => {
    const HorasSemana = await obtenerHorasUsuario();
    DefHoras(HorasSemana);
  };

  // Obtener semanas de usuario
  const obtenerSemanas = async () => {
    try {
      const SemanasBD = await obtenerSemanasUsuario();
      DefSemanas(SemanasBD);
      DefMostrarSemanas(SemanasBD);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerSemanas();
      obtenerHoras();
    }, [])
  );

  // Manejar cambios en el checkbox
  const handleCheckboxChange = (idSem) => {
    setSemanasSeleccionadas((prevSeleccionadas) =>
      prevSeleccionadas.includes(idSem)
        ? prevSeleccionadas.filter((id) => id !== idSem)
        : [...prevSeleccionadas, idSem]
    );
  };

  // Calcular total de horas seleccionadas
  const calcularTotalSeleccionado = () => {
    const horasSeleccionadas = Horas.filter((hora) =>
      semanasSeleccionadas.includes(hora.idSemana)
    );
    return sumarTiempos(horasSeleccionadas.map((item) => item.Total));
  };

  const image = require("../assets/fondo.webp");

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      <View
        style={{
          width: "90%",
          marginTop: height * 0.08,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: scaleFactor > 1 ? 24 : 20,
            fontWeight: "bold",
          }}
        >
          Tabla de semanas
        </Text>
      </View>
      <Text
        style={{
          fontSize: scaleFactor > 1 ? 24 : 20,
          fontWeight: "400",
          marginTop: height * 0.01,
        }}
      >
        Horas formato de total HH:MM:SS
      </Text>

      <View
        style={[
          styles.listContainer,
          {
            padding: width * 0.04,
            marginTop: height * 0.08,
          },
        ]}
      >
        <Pressable
          style={{
            marginTop: -5,
            marginBottom: height * 0.02,
          }}
          onPress={() => setSemanasSeleccionadas([])}
          disabled={semanasSeleccionadas.length === 0}
        >
          <Ionicons
            name="refresh-circle"
            size={50 * scaleFactor}
            color={
              semanasSeleccionadas.length === 0 ? "gray" : "black"
            }
          />
        </Pressable>
        <Text
          style={{
            marginLeft: width * 0.15,
            marginTop: -height * 0.06,
            fontSize: 14 * scaleFactor,
          }}
        >
          Fecha de inicio - Fecha de fin
        </Text>

        {/* Botón para abrir el modal de horas */}
        <Pressable
          style={{
            marginTop: -height * 0.04,
            marginLeft: width * 0.65,
          }}
          onPress={openModal}
        >
          <Ionicons name="add-circle" size={50 * scaleFactor} />
        </Pressable>

        {/* Botón para abrir el nuevo modal de reporte */}
        <Pressable
          style={{
            marginTop: height * 0,  // Ajustamos este valor para que esté justo entre los dos botones de arriba y los registros
            marginLeft: width * 0.35,
          }}
          onPress={openModalReporte}
          disabled={semanasSeleccionadas.length === 0}
        >
          <Ionicons
            name="document-text"
            size={50 * scaleFactor}
            color={semanasSeleccionadas.length === 0 ? "gray" : "black"}
          />
        </Pressable>


        <ModalFormulario
          modalVisible={modalVisible}
          closeModal={closeModal}
          closeModalAndSent={closeModalAndSent}
          formData={formData}
          setFormData={setFormData}
          handleDateChange={(field, value) => {}}
          handleTimeChange={(field, value) => {}}
        />

        {/* Modal de reporte */}
        <ModalReporte
          modalVisible={modalReporteVisible}
          closeModal={() => DetModalReporteVisible(false)}
          closeModalAndSent={closeModalAndSent}
          formData={formData}
        />

        {MostrarSemanas ? (
          <>
            <View style={{ marginBottom: height * 0.02 }} />
            <FlatList
              data={Semanas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Checkbox
                    value={semanasSeleccionadas.includes(item.id)}
                    onValueChange={() => handleCheckboxChange(item.id)}
                    style={{
                      width: 30 * scaleFactor,
                      height: 30 * scaleFactor,
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
            <View style={{ marginTop: height * 0.02 }}>
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: "bold",
                }}
              >
                Total acumulado: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: "bold",
                  marginTop: height * 0.01,
                }}
              >
                Total de horas seleccionadas: ({" "}
                {calcularTotalSeleccionado()} )
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ fontSize: 18 * scaleFactor }}>No hay registros</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  txt: {
    color: "white",
    fontSize: 12,
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
