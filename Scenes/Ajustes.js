import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
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
  const rotateY = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

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

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value}deg` }],
      backfaceVisibility: "hidden",
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value + 180}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const handleFlip = () => {
    const nextRotation = rotateY.value === 0 ? 180 : 0;
    rotateY.value = withTiming(nextRotation, { duration: 500 });
  };

  if (!usuario) {
    return null;
  }

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Ajustes</Text>
      </View>
      <TouchableWithoutFeedback onPress={handleFlip}>
        <View style={styles.cardContainer}>
          {/* Tarjeta Frontal */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <Ionicons name="person-circle-outline" size={80 * scaleFactor} color="white" />
            <Text style={styles.userName}>{usuario.nombre}</Text>
            <Text style={styles.tapToFlip}>Toca para ver detalles</Text>
          </Animated.View>

          {/* Tarjeta Trasera */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Ionicons name="person-circle-outline" size={80 * scaleFactor} color="white" />
            <Text style={styles.userDetail}>Nombre: {usuario.nombre}</Text>
            <Text style={styles.userDetail}>Código: {usuario.codigo}</Text>
            <Text style={styles.userDetail}>{usuario.tipoServidor}</Text>
            <Text style={styles.tapToFlip}>Toca para regresar</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.customButton}
          onPress={() => navigation.navigate("PaginaModificarUsusario")}
        >
          <Ionicons name="person-outline" size={24 * scaleFactor} color="white" style={styles.icon} />
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
          <Ionicons name="trash-outline" size={24 * scaleFactor} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Borrar Usuario</Text>
        </Pressable>
        <Pressable
          style={styles.customButton}
          onPress={() => navigation.navigate("Ingreso")}
        >
          <Ionicons name="log-out-outline" size={24 * scaleFactor} color="white" style={styles.icon} />
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
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: "#2272A7",
  },
  cardBack: {
    backgroundColor: "#18537a",
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
    backgroundColor: "#2272A7",
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
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    position: "absolute",
    top: "12%",
    alignItems: "center",
  },
  cardContainer: {
    width: "80%",
    height: "30%",
    position: "relative",
  },
});