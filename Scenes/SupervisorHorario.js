import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ModalInscritos from "../Modulos/ModalInscritosHorario";
import { fetchHorarios } from "../Modulos/Operaciones Supabase/HorarioSupa";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

// Días de la semana
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Función para formatear la hora en formato de 12 horas
const formatHour = (hour) => {
  const period = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:00 ${period}`;
};

const PaginaSupervisorHorario = () => {
  // Estado para almacenar la grilla de horarios obtenida desde Supabase
  const [scheduleData, setScheduleData] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para la celda seleccionada (día, hora y lista de inscritos)
  const [selectedCellData, setSelectedCellData] = useState({
    day: "",
    hour: 0,
    persons: [],
  });

  // Función que carga los horarios desde Supabase usando fetchHorarios
  const loadHorarios = async () => {
    const Udata = await ObtenerDatosUsuario();
    const data = await fetchHorarios(Udata.idDepartamento);
    if (data) {
      setScheduleData(data);
    }
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  // Al tocar una celda, se abre el modal si hay inscritos
  const handleCellPress = (day, hour) => {
    const persons = scheduleData[day][hour];
    if (persons && persons.length > 0) {
      setSelectedCellData({ day, hour, persons });
      setModalVisible(true);
    }
  };

  // Arreglo de horas de 7 a 21
  const hours = Array.from({ length: 21 - 7 + 1 }, (_, i) => i + 7);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Horario de Inscripciones</Text>
      {scheduleData ? (
        <ScrollView>
          <ScrollView horizontal>
            <View style={styles.grid}>
              {/* Encabezado de la grilla */}
              <View style={styles.row}>
                <View style={[styles.cell, styles.headerCell]} />
                {days.map((day) => (
                  <View key={day} style={[styles.cell, styles.headerCell]}>
                    <Text style={styles.headerText}>{day}</Text>
                  </View>
                ))}
              </View>
              {/* Filas de horas */}
              {hours.map((hour) => (
                <View key={hour} style={styles.row}>
                  <View style={[styles.cell, styles.hourCell]}>
                    <Text style={styles.hourText}>{formatHour(hour)}</Text>
                  </View>
                  {days.map((day) => {
                    const cellData = scheduleData[day][hour];
                    const isRegistered = cellData && cellData.length > 0;
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.cell,
                          isRegistered ? styles.registeredCell : styles.emptyCell,
                        ]}
                        onPress={() => handleCellPress(day, hour)}
                        disabled={!isRegistered}
                      >
                        {isRegistered && (
                          <Text style={styles.registeredText}>
                            {cellData.length} inscritos
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      ) : (
        <Text style={styles.loadingText}>Cargando datos...</Text>
      )}
      <ModalInscritos
        visible={modalVisible}
        day={selectedCellData.day}
        hour={selectedCellData.hour}
        persons={selectedCellData.persons}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {},
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
  },
  hourCell: {
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontWeight: "bold",
  },
  hourText: {},
  registeredCell: {
    backgroundColor: "blue", // Celda azul cuando hay inscritos
  },
  emptyCell: {
    backgroundColor: "#fff",
  },
  registeredText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default PaginaSupervisorHorario;
