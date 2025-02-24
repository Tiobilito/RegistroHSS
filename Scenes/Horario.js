import React, { useState, useEffect, useRef } from "react";
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
  // Estado inicial del horario: cada día con un arreglo de horas vacíos
  const initialSchedule = days.reduce(
    (acc, day) => ({ ...acc, [day]: [] }),
    {}
  );
  const [scheduleData, setScheduleData] = useState(initialSchedule);

  // Ref para sincronizar el scroll horizontal de la grilla con el encabezado
  const headerScrollRef = useRef(null);

  // Función para alternar (agregar o eliminar) la asistencia en una celda
  const toggleAttendance = (day, hour) => {
    setScheduleData((prev) => {
      const daySchedule = prev[day] || [];
      if (daySchedule.includes(hour)) {
        return { ...prev, [day]: daySchedule.filter((h) => h !== hour) };
      } else {
        return {
          ...prev,
          [day]: [...daySchedule, hour].sort((a, b) => a - b),
        };
      }
    });
  };

  // Arreglo de horas desde las 7 hasta las 21 (9:00 PM) inclusive
  const hours = Array.from({ length: 21 - 7 + 1 }, (_, i) => i + 7);

  // Función para guardar el horario
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

  // Función para cargar el horario guardado
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

  // Sincroniza el scroll horizontal de la grilla con el encabezado de días
  const onGridHorizontalScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Horario de Asistencia</Text>
      <View style={styles.scheduleContainer}>
        {/* Encabezado fijo: días */}
        <View style={styles.headerRow}>
          <View style={styles.topLeftCell} />
          <ScrollView
            horizontal
            ref={headerScrollRef}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
          >
            {days.map((day) => (
              <View key={day} style={[styles.cell, styles.headerCell]}>
                <Text style={styles.headerText}>{day}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Cuerpo con scroll vertical */}
        <ScrollView style={styles.bodyScrollView}>
          <View style={styles.bodyRow}>
            {/* Columna fija: horas */}
            <View style={styles.leftColumn}>
              {hours.map((hour) => (
                <View key={hour} style={[styles.cell, styles.hourCell]}>
                  <Text style={styles.hourText}>{formatHour(hour)}</Text>
                </View>
              ))}
            </View>
            {/* Grilla de asistencia: scroll horizontal y vertical */}
            <ScrollView
              horizontal
              onScroll={onGridHorizontalScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={true}
            >
              <View>
                {hours.map((hour) => (
                  <View key={hour} style={styles.row}>
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
          </View>
        </ScrollView>
      </View>
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
  scheduleContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: "row",
  },
  topLeftCell: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  bodyScrollView: {
    flex: 1,
  },
  bodyRow: {
    flexDirection: "row",
  },
  leftColumn: {
    // La columna de horas se mantiene fija
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 70,
    height: 70,
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
