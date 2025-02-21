import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { GuardarHorarioUsuario, ObtenerHorarioUsuario } from "../Modulos/InfoUsuario";
import { RespaldarHorarioUsuario } from "../Modulos/Operaciones Supabase/HorarioSupa";

// Días de la semana
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Función para formatear la hora en formato de 12 horas
const formatHour = (hour) => {
  const period = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:00 ${period}`;
};

const PaginaHorario = () => {
  const initialSchedule = days.reduce(
    (acc, day) => ({ ...acc, [day]: [] }),
    {}
  );
  const [scheduleData, setScheduleData] = useState(initialSchedule);

  const toggleAttendance = (day, hour) => {
    setScheduleData((prev) => {
      const daySchedule = prev[day] || [];
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

  const hours = Array.from({ length: 21 - 7 + 1 }, (_, i) => i + 7);

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

  useEffect(() => {
    cargarHorario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Horario de Asistencia</Text>
      <ScrollView>
        <ScrollView horizontal>
          <View style={styles.grid}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell]} />
              {days.map((day) => (
                <View key={day} style={[styles.cell, styles.headerCell]}>
                  <Text style={styles.headerText}>{day}</Text>
                </View>
              ))}
            </View>
            {hours.map((hour) => (
              <View key={hour} style={styles.row}>
                <View style={[styles.cell, styles.hourCell]}>
                  <Text style={styles.hourText}>{formatHour(hour)}</Text>
                </View>
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
      <TouchableOpacity style={styles.saveButton} onPress={guardarHorario}>
        <Text style={styles.saveButtonText}>Guardar Horario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#e6f0fc",
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
  saveButton: {
    backgroundColor: "#2272A7",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaginaHorario;
