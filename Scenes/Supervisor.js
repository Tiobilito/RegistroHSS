import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { obtenerPrestadores, actualizarEstadoPrestador } from "../Modulos/Operaciones Supabase/UsuariosSupa";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

export default function Supervisor({ navigation }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estado, setEstado] = useState(""); 
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]); 
  const [UserD, setUserD] = useState(null); 

  const image = require("../assets/Back.png"); // Ruta de la imagen de fondo

  // Cargar los estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      const dataU = await ObtenerDatosUsuario();
      setUserD(dataU);
      const data = await obtenerPrestadores(dataU.idDepartamento); 
      setEstudiantes(data);
      setFilteredEstudiantes(data); 
    };

    fetchEstudiantes();
  }, []);

  // Filtrar estudiantes por estado
  const filterEstudiantesByState = (selectedState) => {
    let filteredData = estudiantes;

    if (selectedState === "Aprobado") {
      filteredData = estudiantes.filter(item => item.Validado === true);
    } else if (selectedState === "Rechazado") {
      filteredData = estudiantes.filter(item => item.Validado === false);
    } else if (selectedState === "Sin estado") {
      filteredData = estudiantes.filter(item => item.Validado === null);
    } else if (selectedState === "Todos") {
      filteredData = estudiantes;
    }

    setFilteredEstudiantes(filteredData);
  };

  // Validar estudiante y actualizar estado en la base de datos
  const handleValidar = async (codigo, estado) => {
    if (estado === "") {
      Alert.alert("Por favor selecciona un estado.");
      return;
    }

    let estadoFinal;
    if (estado === "Validado") {
      estadoFinal = null; // Establecer como null (sin estado asignado)
    } else if (estado === "Aprobado") {
      estadoFinal = true; // Establecer como aprobado (true)
    } else if (estado === "Rechazado") {
      estadoFinal = false; // Establecer como rechazado (false)
    }

    // Actualizar estado del estudiante en la base de datos
    const result = await actualizarEstadoPrestador(codigo, estadoFinal);
    if (result) {
      Alert.alert(`Estudiante con código ${codigo} ha sido ${estado}.`);
      // Recargar los estudiantes después de la actualización
      const updatedEstudiantes = await obtenerPrestadores(UserD.idDepartamento);
      setEstudiantes(updatedEstudiantes);
      setFilteredEstudiantes(updatedEstudiantes); // Actualizar la lista filtrada también
    } else {
      Alert.alert("Error al actualizar el estado del estudiante.");
    }
  };

  // Función para asignar el color del círculo basado en el estado
  const getEstadoColor = (estado) => {
    if (estado === null) {
      return "gray"; // Sin estado asignado
    } else if (estado === true) {
      return "green"; // Aprobado
    } else if (estado === false) {
      return "red"; // Rechazado
    }
  };

  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Candidatos Servicio</Text>

        {/* Subtítulo para los filtros */}
        <Text style={styles.filterSubtitle}>Filtrar por:</Text>

        {/* Filtros por estado usando los círculos de colores y los nombres fuera del círculo */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton} onPress={() => filterEstudiantesByState("Aprobado")}>
              <View style={[styles.estadoCircle, { backgroundColor: "green" }]} />
              <Text style={styles.filterText}>Aprobado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => filterEstudiantesByState("Rechazado")}>
              <View style={[styles.estadoCircle, { backgroundColor: "red" }]} />
              <Text style={styles.filterText}>Rechazado</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton} onPress={() => filterEstudiantesByState("Sin estado")}>
              <View style={[styles.estadoCircle, { backgroundColor: "gray" }]} />
              <Text style={styles.filterText}>Sin estado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => filterEstudiantesByState("Todos")}>
              <Text style={styles.filterText}>Mostrar Todos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={filteredEstudiantes} // Usamos la lista filtrada
          keyExtractor={(item) => item.Codigo.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.studentInfoContainer}>
                {/* Nombre y código a la izquierda */}
                <Text style={styles.text}>
                  {item.Nombre} - {item.Codigo}
                </Text>

                {/* Contenedor para el círculo de estado y el Picker */}
                <View style={styles.pickerContainer}>
                  <View style={[styles.estadoCircle, { backgroundColor: getEstadoColor(item.Validado) }]} />
                  <Picker
                    selectedValue={item.Validado === null ? "Validado" : item.Validado ? "Aprobado" : "Rechazado"}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setEstado(itemValue);
                      handleValidar(item.Codigo, itemValue); // Actualizar el estado directamente
                    }}
                  >
                    <Picker.Item label="Selecciona una opción" value="Validado" />
                    <Picker.Item label="Aprobado" value="Aprobado" />
                    <Picker.Item label="Rechazado" value="Rechazado" />
                  </Picker>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center", // Asegura que los elementos estén centrados dentro del fondo
    alignItems: "center",
    width: "100%", // Fondo de imagen cubriendo toda la pantalla
  },
  container: {
    flex: 1,
    padding: 30, // Mayor padding para dar más espacio
    width: "95%", // Aumentamos el ancho de todo el contenedor
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 28, // Título más grande
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 80, // Baja el título
  },
  filterSubtitle: {
    fontSize: 18, // Subtítulo para los filtros
    fontWeight: "bold",
    marginBottom: 10, // Espacio debajo del subtítulo
    textAlign: "center", // Centrado
  },
  filtersContainer: {
    marginBottom: 20,
    backgroundColor: "#fcfcfc", // Fondo gris claro para los filtros
    borderRadius: 10, // Bordes redondeados para los filtros
    padding: 15, // Espaciado interno
    borderColor: "grey", // Borde negro
    borderWidth: 0.3, // Grosor del borde
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // Añadir un pequeño espacio entre las filas de los filtros
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10, // Padding para dar espacio alrededor del filtro
    borderRadius: 10, // Bordes redondeados para los filtros
  },
  filterText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10, // Espacio entre el círculo y el texto
  },
  studentInfoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Alinear el texto y el picker a la izquierda
    alignItems: "center", // Asegura que el texto y el picker estén centrados
    marginBottom: 10,
    backgroundColor: "#fcfcfc", // Fondo gris claro para los filtros
    borderRadius: 10,
    borderColor: "grey", // Borde negro
    borderWidth: 0.3, // Grosor del borde
  },
  text: {
    fontSize: 16, // Nombre más pequeño para que todo se acomode
    fontWeight: "bold",
    width: "40%", // Ajuste para que el nombre ocupe menos espacio
  },
  pickerContainer: {
    width: "55%", // Hacer el Picker más estrecho
    flexDirection: "row",
    alignItems: "center", // Alinear el círculo con el Picker
    borderRadius: 10, // Bordes redondeados
    padding: 5, // Padding para el Picker
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
  },
  estadoCircle: {
    width: 20, // Aumento el tamaño del círculo de estado
    height: 20,
    borderRadius: 15,
  },
});
