import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import FlipCard from "react-native-flip-card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EliminarUsuarioHoras } from "../Modulos/Operaciones Supabase/HorasSupa";
import {
  BorrarDatosUsuario,
  ObtenerDatosUsuario,
} from "../Modulos/InfoUsuario";
import { supabase } from "../Modulos/Operaciones Supabase/supabase";

const image = require("../assets/fondo.webp");

export default function PaginaAjustes({ navigation }) {
  const { width } = useWindowDimensions();
  const scaleFactor = width / 375;

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const datos = await ObtenerDatosUsuario();
      if (datos) {
        const usuarioData = {
          codigo: datos.Codigo || "Código no disponible",
        };

        const { data, error } = await supabase
          .from("Usuarios")
          .select("Nombre, TipoServidor")
          .eq("Codigo", usuarioData.codigo)
          .single();

        if (error) {
          usuarioData.nombre = "Nombre no disponible";
          usuarioData.tipoServidor = "Tipo de servidor no disponible";
        } else {
          usuarioData.nombre = data.Nombre || "Nombre no disponible";
          usuarioData.tipoServidor =
            data.TipoServidor || "Tipo de servidor no disponible";
        }

        setUsuario(usuarioData);
      }
    };
    cargarDatosUsuario();
  }, []);

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.container}>
      <View style={{marginTop: "20%", height: "30%", marginBottom: "10%"}}>
        <FlipCard
          friction={8}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
        >
          <View style={styles.cardFront}>
            <Ionicons
              name="person-circle-outline"
              size={80 * scaleFactor}
              color="white"
            />
            <Text style={styles.userName}>{usuario.nombre}</Text>
            <Text style={styles.tapToFlip}>Toca para ver detalles</Text>
          </View>
          <View style={styles.cardBack}>
            <Ionicons
              name="person-circle-outline"
              size={80 * scaleFactor}
              color="white"
            />
            <Text style={styles.userDetail}>Nombre: {usuario.nombre}</Text>
            <Text style={styles.userDetail}>Código: {usuario.codigo}</Text>
            <Text style={styles.userDetail}>{usuario.tipoServidor}</Text>
            <Text style={styles.tapToFlip}>Toca para regresar</Text>
          </View>
        </FlipCard>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.customButton}
          onPress={() => navigation.navigate("PaginaModificarUsusario")}
        >
          <Ionicons
            name="person-outline"
            size={24 * scaleFactor}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Editar usuario</Text>
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
              ]
            );
          }}
        >
          <Ionicons
            name="trash-outline"
            size={24 * scaleFactor}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Borrar Usuario</Text>
        </Pressable>

        <Pressable
          style={styles.customButton}
          onPress={() => navigation.navigate("Ingreso")}
        >
          <Ionicons
            name="log-out-outline"
            size={24 * scaleFactor}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000aa",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  cardFront: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 10,
  },
  cardBack: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 10,
  },
  userName: {
    fontSize: 22,
    color: "white",
    marginVertical: 10,
  },
  tapToFlip: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  userDetail: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
});
