import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { GuardarHorarioUsuario, ObtenerHorarioUsuario } from "../Modulos/InfoUsuario";
import { RespaldarHorarioUsuario } from "../Modulos/OperacionesBD";

// Días de la semana
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Función para formatear la hora en formato de 12 horas
const formatHour = (hour) => {
  const period = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:00 ${period}`;
};

const PaginaHorario = () => {
  // Estado de asistencia: cada día contiene un arreglo de horas (números) en las que el usuario asiste.
  // Inicialmente, se crea un objeto con cada día y un arreglo vacío.
  const initialSchedule = days.reduce(
    (acc, day) => ({ ...acc, [day]: [] }),
    {}
  );
  const [scheduleData, setScheduleData] = useState(initialSchedule);

  // Función para alternar (agregar o eliminar) la asistencia en una celda
  const toggleAttendance = (day, hour) => {
    setScheduleData((prev) => {
      const daySchedule = prev[day] || [];
      // Si la hora ya está registrada, se elimina; de lo contrario, se agrega
      if (daySchedule.includes(hour)) {
        return {
          ...prev,
          [day]: daySchedule.filter((h) => h !== hour),
        };
      } else {
        return {
          ...prev,
          [day]: [...daySchedule, hour].sort((a, b) => a - b),
        };
      }
    });
  };

  // Crear un arreglo de horas desde las 7 hasta las 21 (9:00 PM) inclusive.
  const hours = Array.from({ length: 21 - 7 + 1 }, (_, i) => i + 7);

  // Función para guardar el horario en AsyncStorage
  const guardarHorario = async () => {
    try {
      const horarioExistente = await ObtenerHorarioUsuario();
      if (horarioExistente) {
        Alert.alert(
          "Confirmación",
          "Ya existe un horario registrado. ¿Desea sobrescribirlo?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sobrescribir",
              onPress: async () => {
                await GuardarHorarioUsuario(scheduleData);
                await RespaldarHorarioUsuario();
                Alert.alert("Horario guardado y respaldado exitosamente.");
              },
            },
          ]
        );
      } else {
        await GuardarHorarioUsuario(scheduleData);
        await RespaldarHorarioUsuario();
        Alert.alert("Horario guardado y respaldado exitosamente.");
      }
    } catch (error) {
      console.error("Error guardando el horario:", error);
      Alert.alert("Error guardando el horario.");
    }
  };

  // Función para cargar el horario desde AsyncStorage
  const cargarHorario = async () => {
    try {
      const horario = await ObtenerHorarioUsuario();
      if (horario != null) {
        setScheduleData(horario);
      }
    } catch (error) {
      console.error("Error cargando el horario:", error);
    }
  };

  // Cargar el horario al iniciar la ventana
  useEffect(() => {
    cargarHorario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Horario de Asistencia</Text>
      <ScrollView>
        <ScrollView horizontal>
          <View style={styles.grid}>
            {/* Encabezado: celda vacía para la columna de horas y luego los días */}
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
                {/* Primera celda: la hora */}
                <View style={[styles.cell, styles.hourCell]}>
                  <Text style={styles.hourText}>{formatHour(hour)}</Text>
                </View>
                {/* Celdas para cada día */}
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.cell,
                      scheduleData[day].includes(hour)
                        ? styles.attendedCell
                        : styles.emptyCell,
                    ]}
                    onPress={() => toggleAttendance(day, hour)}
                  >
                    {scheduleData[day].includes(hour) && (
                      <Text style={styles.attendedText}>Asistir</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      <Button title="Guardar Horario" onPress={guardarHorario} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  Header: {
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
  attendedCell: {
    backgroundColor: "#4caf50",
  },
  emptyCell: {
    backgroundColor: "#fff",
  },
  attendedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaginaHorario;
