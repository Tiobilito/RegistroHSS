import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
} from "react-native";
import { changePassword, checkUser } from "../Modulos/OperacionesBD";

const image = require("../assets/Back.png");

export default function ChangePassword({ navigation }) {
  const [isVer, setIsVer] = useState(false); // Para controlar qué paso mostrar
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");

  // Obtén las dimensiones actuales de la pantalla
  const { width, height } = useWindowDimensions();

  async function verificationUser() {
    try {
      const get = await checkUser(code);
      if (get) {
        console.log("Usuario verificado");
        setIsVer(true);
      } else {
        Alert.alert("El usuario no existe :(");
      }
    } catch (error) {
      console.error("Error en la verificación del usuario:", error);
      Alert.alert("Error en la verificación del usuario");
    }
  }

  async function verification() {
    try {
      if (password === newPassword) {
        Alert.alert("Las contraseñas son iguales");
        await changePassword(password, code);
        navigation.navigate("Ingreso");
      } else {
        Alert.alert("Las contraseñas no son iguales :(");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      Alert.alert("Error al cambiar la contraseña");
    }
  }

  // Función simple para escalar fuentes (puedes personalizarla)
  const scaleFont = (size) => (width / 375) * size;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={image} style={styles.imgBackground}>
        {!isVer ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { fontSize: scaleFont(24) }]}>
                Cambiar contraseña
              </Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                Código
              </Text>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Código"
                onChangeText={setCode}
              />
            </View>

            <Pressable style={[styles.btnIngresar, { width: "60%" }]} onPress={verificationUser}>
              <Text style={styles.txtBtn}>Cambiar contraseña</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={{ width: "80%", marginVertical: 20 }}>
              <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                Escribe la nueva contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                Escribe nuevamente la contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#888"
                secureTextEntry
                value={newPassword}
                onChangeText={setnewPassword}
              />
            </View>
            <Pressable style={[styles.btnIngresar, { width: "60%" }]} onPress={verification}>
              <Text style={styles.txtBtn}>Cambiar contraseña</Text>
            </Pressable>
          </>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "5%",
  },
  subtitleContainer: {
    alignSelf: "stretch",
    paddingHorizontal: "5%",
  },
  title: {
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    marginBottom: 5,
    color: "black",
  },
  input: {
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 15,
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 20,
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
  },
});
