import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, ImageBackground, Pressable, useWindowDimensions } from "react-native";
import FlipCard from "react-native-flip-card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EliminarUsuarioHoras } from "../Modulos/Operaciones Supabase/HorasSupa";
import { BorrarDatosUsuario, ObtenerDatosUsuario } from "../Modulos/InfoUsuario";
import { supabase } from "../Modulos/Operaciones Supabase/supabase";

const image = require("../assets/fondo.webp");

export default function PaginaAjustes({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  // Estado para guardar los datos del usuario
  const [usuario, setUsuario] = useState(null);

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const datos = await ObtenerDatosUsuario();
      console.log("Datos del usuario:", datos);  // Verifica los datos que recibes

      if (datos) {
        // Primero, guarda los datos obtenidos de ObtenerDatosUsuario
        const usuarioData = {
          codigo: datos.Codigo || "Código no disponible",
        };

        // Realiza la consulta a Supabase para obtener el nombre y tipo de servidor
        const { data, error } = await supabase
          .from('Usuarios') // Asume que la tabla de usuarios se llama 'Usuarios'
          .select('Nombre, TipoServidor') // Obtener tanto el nombre como el tipo de servidor
          .eq('Codigo', usuarioData.codigo)
          .single(); // Debe retornar solo un resultado, ya que el código debe ser único

        if (error) {
          console.error("Error al obtener los datos del usuario:", error.message);
          usuarioData.nombre = "Nombre no disponible";
          usuarioData.tipoServidor = "Tipo de servidor no disponible";
        } else {
          usuarioData.nombre = data.Nombre || "Nombre no disponible";
          usuarioData.tipoServidor = data.TipoServidor || "Tipo de servidor no disponible"; // Asignamos el tipo de servidor
        }

        // Actualiza el estado con los datos completos del usuario
        setUsuario(usuarioData);
      }
    };

    cargarDatosUsuario();
  }, []);

  // Si los datos aún no se han cargado
  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      <View style={[styles.headerContainer, { marginTop: height * 0.06, marginBottom: 30 }]}>
        <Text style={[styles.headerText, { fontSize: scaleFactor > 1 ? 40 : 35 }]}>
          Ajustes
        </Text>
      </View>

      <View style={styles.flipCardWrapper}>
        <FlipCard
          friction={8}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          style={styles.flipCardContainer}
        >
          <View style={styles.cardFront}>
            <Ionicons name="person-circle-outline" size={80 * scaleFactor} color="white" />
            <Text style={styles.userName}>{usuario.nombre}</Text>
            <Text style={styles.tapToFlip}>Toca para ver detalles</Text>
          </View>

          <View style={styles.cardBack}>
          <Ionicons name="person-circle-outline" size={80 * scaleFactor} color="white" />
          <Text style={styles.userDetail}>Nombre: {usuario.nombre || "Nombre no disponible"}</Text>
          <Text style={styles.userDetail}>Código: {usuario.codigo || "Código no disponible"}</Text>
          <Text style={styles.userDetail}>{usuario.tipoServidor || "Tipo de servidor no disponible"}</Text>
            <Text style={styles.tapToFlip}>Toca para regresar</Text>
          </View>
        </FlipCard>
      </View>

      <View style={[styles.buttonsContainer, { marginTop: 270 }]}>
        <Pressable
          style={styles.customButton}
          onPress={() => navigation.navigate("PaginaModificarUsusario")}
        >
          <Ionicons name="person-outline" size={24 * scaleFactor} color="white" style={{ marginRight: 10 }} />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>Editar usuario</Text>
        </Pressable>

        <Pressable
          style={styles.customButton}
          onPress={() => {
            Alert.alert(
              "Confirmación",
              "¿Estás seguro de que quieres continuar?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Borrar",
                  onPress: () => {
                    EliminarUsuarioHoras();
                    BorrarDatosUsuario();
                    navigation.navigate("Ingreso");
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Ionicons name="trash-outline" size={24 * scaleFactor} color="white" style={{ marginRight: 10 }} />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>Borrar Usuario</Text>
        </Pressable>

        <Pressable style={styles.customButton} onPress={() => navigation.navigate("Ingreso")}>
          <Ionicons name="log-out-outline" size={24 * scaleFactor} color="white" style={{ marginRight: 10 }} />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontWeight: "bold",
    color: "black",
  },
  flipCardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  flipCardContainer: {
    width: "90%",
  },
  cardFront: {
    width: "100%",
    height: 250,
    backgroundColor: "#2272A7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 20,
  },
  cardBack: {
    width: "100%",
    height: 250,
    backgroundColor: "#1E5B87",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 20,
  },
  userName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  userDetail: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  tapToFlip: {
    marginTop: 8,
    fontSize: 14,
    color: "white",
    opacity: 0.7,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2272A7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
