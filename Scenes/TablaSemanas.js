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
import ModalFormulario from "../Modulos/Modales/ModalFormularioHoras";
import ModalReporte from "../Modulos/Modales/ModalReporte";
import ModalTablaHoras from "../Modulos/Modales/ModalTablaHoras";
import {
  añadirHoraModal,
  obtenerHorasUsuario,
} from "../Modulos/Base de Datos Sqlite/Horas";
import { obtenerSemanasUsuario } from "../Modulos/Base de Datos Sqlite/Semanas";
import { sumarTiempos } from "../Modulos/Base de Datos Sqlite/Utilidades";
import { obtenerReportes } from "../Modulos/Operaciones Supabase/ReportesSupa";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario"; // Para obtener los datos del usuario logueado
import ModalReporteUsuario from "../Modulos/Modales/ModalReporteUsuario"; // Ajusta la ruta según sea necesario

export default function PaginaTablaSemanas({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  // Estados para modales y datos
  const [modalVisible, DetModalVisible] = useState(false);
  const [modalReporteVisible, DetModalReporteVisible] = useState(false);
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
    descripcion: "",
  });

  // Estados para el modal de tabla de horas
  const [modalHorasVisible, setModalHorasVisible] = useState(false);
  const [selectedIdSem, setSelectedIdSem] = useState(null);

  // Estados para el modal
  const [modalReporteUsuarioVisible, setModalReporteUsuarioVisible] = useState(false);
  const [reportesUsuario, setReportesUsuario] = useState([]);

  // Función para abrir el modal de reportes del usuario
  const openModalReporteUsuario = async () => {
    const reportes = await obtenerReportesDelUsuario(); // Obtener los reportes del usuario logueado
    //console.log('Reportes obtenidos:', reportes);
    setReportesUsuario(reportes); // Guardamos los reportes en el estado
    setModalReporteUsuarioVisible(true); // Abrimos el modal
  };
  // Función para actualizar la descripción
  const handleDescripcionChange = (text) => {
    setFormData({
      ...formData,
      descripcion: text,
    });
  };

  // Función para construir una fecha a partir de los valores del formulario
  const construirFecha = (day, month, year, hours, minutes, seconds) => {
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  // Función para obtener el periodo de las semanas seleccionadas
  const obtenerPeriodo = () => {
    if (semanasSeleccionadas.length === 0)
      return { periodoInicio: "", periodoFin: "" };

    const semanasSeleccionadasData = Semanas.filter((semana) =>
      semanasSeleccionadas.includes(semana.id)
    );

    semanasSeleccionadasData.sort(
      (a, b) => new Date(a.Inicio) - new Date(b.Inicio)
    );

    const periodoInicio = semanasSeleccionadasData[0].Inicio;
    const periodoFin =
      semanasSeleccionadasData[semanasSeleccionadasData.length - 1].Fin;

    return { periodoInicio, periodoFin };
  };

  // Abrir modal para el formulario de horas
  const openModal = () => {
    DetModalVisible(true);
  };

  // Abrir modal para el reporte de semanas seleccionadas
  const openModalReporte = () => {
    const { periodoInicio, periodoFin } = obtenerPeriodo();
    const horasReportadas = calcularTotalSeleccionado(); // Calcula las horas reportadas

    setFormData({
      ...formData,
      fechaReporte: new Date().toLocaleDateString(),
      horasReportadas: horasReportadas,
      periodoInicio: periodoInicio,
      periodoFin: periodoFin,
    });

    DetModalReporteVisible(true);
  };

  // Cerrar el modal de horas (formulario)
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

  // Función para obtener solo los reportes del usuario logueado
  const obtenerReportesDelUsuario = async () => {
    const Udata = await ObtenerDatosUsuario(); // Obtener los datos del usuario logueado
    const reportes = await obtenerReportes(Udata.idDepartamento); // Obtener todos los reportes de ese departamento

    // Verificar los tipos y asegurar la comparación correcta
    const reportesUsuario = reportes.filter((reporte) => 
      parseInt(reporte.CodigoUsuario, 10) === parseInt(Udata.Codigo, 10) // Aseguramos que ambos sean enteros
    );

    //console.log("Reportes filtrados:", reportesUsuario); // Verifica los reportes después de filtrarlos

    return reportesUsuario;
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
          { padding: width * 0.04, marginTop: height * 0.08 },
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
            color={semanasSeleccionadas.length === 0 ? "gray" : "black"}
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

        {/* Botón para abrir el modal de horas (formulario) */}
        <Pressable
          style={{
            marginTop: -height * 0.04,
            marginLeft: width * 0.65,
          }}
          onPress={openModal}
        >
          <Ionicons name="add-circle" size={50 * scaleFactor} />
        </Pressable>

        {/* Botón para abrir el modal de reporte */}
        <Pressable
          style={{
            marginTop: 0,
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

        <ModalReporte
          modalVisible={modalReporteVisible}
          closeModal={() => DetModalReporteVisible(false)}
          closeModalAndSent={closeModalAndSent}
          formData={formData}
        />

        {/* Listado de semanas */}
        {MostrarSemanas ? (
          <>
            <View style={{ marginBottom: height * 0.02 }} />
            <FlatList
              data={Semanas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.item,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
                >
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
                  <Text style={[styles.txt, { flex: 1, marginLeft: 10 }]}>
                    {item.Inicio} - {item.Fin}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSelectedIdSem(item.id);
                      setModalHorasVisible(true);
                    }}
                  >
                    <Ionicons name="list-circle" size={35} color="white" />
                  </Pressable>
                </View>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between', // Esto alineará los elementos a los extremos
                width: '100%', // Asegura que ocupe todo el ancho disponible
                marginTop: height * 0.02, // Margen entre los elementos
              }}
            >
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: "bold",
                  flex: 1, // Este estilo asegura que el texto ocupe el espacio disponible
                }}
              >
                Total acumulado: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
              <Pressable
                style={{
                  marginTop: 0,
                  alignSelf: 'flex-end',
                }}
                onPress={openModalReporteUsuario}
              >
                <Ionicons name="reader-outline" size={50 * scaleFactor} color="black" />
              </Pressable>
              </View>
              <View
                style={{
                  marginTop: height * 0.01, // Espacio entre el total acumulado y el total de horas seleccionadas
                }}
              >
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: "bold",
                }}
              >
                Total de horas seleccionadas: ( {calcularTotalSeleccionado()} )
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ fontSize: 18 * scaleFactor }}>No hay registros</Text>
        )}
      </View>
      {/* Modal de tabla de horas: lista las horas registradas de la semana seleccionada */}
      <ModalTablaHoras
        modalVisible={modalHorasVisible}
        closeModal={() => setModalHorasVisible(false)}
        idSem={selectedIdSem}
      />
      <ModalReporteUsuario
        visible={modalReporteUsuarioVisible}
        closeModal={() => setModalReporteUsuarioVisible(false)}
        reportes={reportesUsuario} // Pasamos los reportes obtenidos del usuario logueado
      />
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
