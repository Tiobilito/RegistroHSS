import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ModalInscritos from "../Modulos/Modales/ModalInscritosHorario";
import ModalUsuariosActivos from "../Modulos/Modales/ModalUsuariosActivos";
import { fetchHorarios } from "../Modulos/Operaciones Supabase/HorarioSupa";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";
import { ObtenerActivos } from "../Modulos/Operaciones Supabase/HorarioSupa";

// Días de la semana
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Función para formatear la hora en formato de 12 horas
const formatHour = (hour) => {
  const period = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr}:00 ${period}`;
};

const PaginaSupervisorHorario = () => {
  // Estado para almacenar la grilla de horarios
  const [scheduleData, setScheduleData] = useState(null);
  // Estado para controlar la visibilidad del modal de inscritos
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para la celda seleccionada
  const [selectedCellData, setSelectedCellData] = useState({
    day: "",
    hour: 0,
    persons: [],
  });
  // Nuevos estados para usuarios activos
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeUsersModalVisible, setActiveUsersModalVisible] = useState(false);

  const headerScrollRef = useRef(null);

  // Función que carga los horarios desde Supabase
  const loadHorarios = async () => {
    const Udata = await ObtenerDatosUsuario();
    const data = await fetchHorarios(Udata.idDepartamento);
    if (data) {
      setScheduleData(data);
    }
  };

  // Función para cargar usuarios activos
  const loadActiveUsers = async () => {
    const Udata = await ObtenerDatosUsuario();
    const users = await ObtenerActivos(Udata.idDepartamento);
    if (users) {
      setActiveUsers(users);
    }
  };

  useEffect(() => {
    // Cargar datos iniciales
    loadHorarios();
    loadActiveUsers();
    
    // Configurar actualizaciones periódicas
    const horariosInterval = setInterval(loadHorarios, 30000);
    const usuariosInterval = setInterval(loadActiveUsers, 30000);
    
    return () => {
      clearInterval(horariosInterval);
      clearInterval(usuariosInterval);
    };
  }, []);

  const handleCellPress = (day, hour) => {
    const persons = scheduleData[day][hour];
    if (persons && persons.length > 0) {
      setSelectedCellData({ day, hour, persons });
      setModalVisible(true);
    }
  };

  const hours = Array.from({ length: 21 - 7 + 1 }, (_, i) => i + 7);

  const onGridHorizontalScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: offsetX, animated: false });
    }
  };

  // Componente para el botón de usuarios activos
  const ActiveUsersButton = () => (
    <TouchableOpacity 
      style={styles.activeUsersButton}
      onPress={() => setActiveUsersModalVisible(true)}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.usersContainer}
      >
        {activeUsers.map((user, index) => (
          <View 
            key={user.Codigo} 
            style={[
              styles.userCircle,
              { marginLeft: index !== 0 ? -10 : 0 }
            ]}
          >
            <Text style={styles.userInitial}>
              {user.Nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </TouchableOpacity>
  );

  if (!scheduleData) {
    return <Text style={styles.loadingText}>Cargando datos...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Horario Prestadores</Text>
      <View style={styles.scheduleContainer}>
        {/* Encabezado fijo: fila de días */}
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
        
        {/* Cuerpo: scroll vertical */}
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
            
            {/* Grilla de celdas */}
            <ScrollView
              horizontal
              onScroll={onGridHorizontalScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={true}
            >
              <View>
                {hours.map((hour) => (
                  <View key={hour} style={styles.row}>
                    {days.map((day) => {
                      const cellData = scheduleData[day][hour];
                      const isRegistered = cellData && cellData.length > 0;
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.cell,
                            isRegistered
                              ? styles.registeredCell
                              : styles.emptyCell,
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
          </View>
        </ScrollView>
      </View>
      
      {/* Botón de usuarios activos */}
      <ActiveUsersButton />
      
      {/* Modales */}
      <ModalInscritos
        visible={modalVisible}
        day={selectedCellData.day}
        hour={selectedCellData.hour}
        persons={selectedCellData.persons}
        onClose={() => setModalVisible(false)}
      />
      
      <ModalUsuariosActivos
        visible={activeUsersModalVisible}
        users={activeUsers}
        onClose={() => setActiveUsersModalVisible(false)}
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
  scheduleContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
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
  registeredCell: {
    backgroundColor: "blue",
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
  // Nuevos estilos
  activeUsersButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaginaSupervisorHorario;