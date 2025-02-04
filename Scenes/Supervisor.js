import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, ImageBackground } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { obtenerEstudiantes, actualizarEstadoEstudiante } from "../Modulos/OperacionesBD"; // Función para actualizar el estado

export default function Supervisor({ navigation }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estado, setEstado] = useState(""); // Guardaremos el estado a asignar

  const image = require("../assets/Back.png"); // Ruta de la imagen de fondo

  // Cargar los estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      const data = await obtenerEstudiantes(); // Obtener los estudiantes desde la base de datos
      setEstudiantes(data);
    };

    fetchEstudiantes();
  }, []);

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
    const result = await actualizarEstadoEstudiante(codigo, estadoFinal);
    if (result) {
      Alert.alert(`Estudiante con código ${codigo} ha sido ${estado}.`);
      // Recargar los estudiantes después de la actualización
      const updatedEstudiantes = await obtenerEstudiantes();
      setEstudiantes(updatedEstudiantes);
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

  const handleLogout = () => {
    // Aquí puedes borrar los datos de sesión o realizar cualquier acción de cierre de sesión
    navigation.navigate('Ingreso'); // Redirigir a la pantalla de Ingreso
  };

  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Supervisor</Text>

        {/* Leyenda de los estados */}
        <View style={styles.leyendaContainer}>
          <Text style={styles.leyendaText}>Estados del Estudiante:</Text>
          <View style={styles.estadoContainer}>
            <View
              style={[
                styles.estadoCircle,
                { backgroundColor: "green" }, // Aprobado
              ]}
            />
            <Text style={styles.estadoText}>Aprobado</Text>
          </View>
          <View style={styles.estadoContainer}>
            <View
              style={[
                styles.estadoCircle,
                { backgroundColor: "red" }, // Rechazado
              ]}
            />
            <Text style={styles.estadoText}>Rechazado</Text>
          </View>
          <View style={styles.estadoContainer}>
            <View
              style={[
                styles.estadoCircle,
                { backgroundColor: "gray" }, // Sin estado
              ]}
            />
            <Text style={styles.estadoText}>Sin estado</Text>
          </View>
        </View>

        <FlatList
          data={estudiantes}
          keyExtractor={(item) => item.Codigo.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {/* Aumentar el tamaño del nombre y código */}
              <Text style={styles.text}>
                {item.Nombre} - {item.Codigo}
              </Text>

              {/* Estado debajo del nombre y código */}
              <View style={styles.estadoContainer}>
                <Text style={styles.estadoText}>
                  {item.Validado === null ? "Sin estado" : item.Validado ? "Aprobado" : "Rechazado"}
                </Text>
                <View
                  style={[
                    styles.estadoCircle,
                    { backgroundColor: getEstadoColor(item.Validado) },
                  ]}
                />
              </View>

              {/* El Picker para seleccionar el estado */}
              <View style={styles.pickerContainer}>
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
          )}
        />

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
    marginTop: 50,
  },
  leyendaContainer: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  leyendaText: {
    fontSize: 20, // Tamaño mayor de la leyenda
    fontWeight: "bold",
    marginBottom: 10,
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  estadoText: {
    fontSize: 18, // Texto de estado más grande
    marginLeft: 10, // Mayor espacio entre el texto y el círculo
  },
  estadoCircle: {
    width: 20, // Aumento el tamaño del círculo de estado
    height: 20,
    borderRadius: 15,
    marginLeft: 10, // Espacio entre el texto y el círculo
  },
  pickerContainer: {
    paddingTop: 10,
    marginBottom: 10, // Añadido espacio debajo del Picker
  },
  picker: {
    height: 60,  // Aumento la altura del Picker
    width: "100%", // Asegurar que el Picker ocupe todo el ancho disponible
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#2272A7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%", // Hacer el botón más ancho
  },
  logoutText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
