import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { changePassword, checkUser } from "../Modulos/OperacionesBD";

const Scale = Dimensions.get("window").width;
const image = require("../assets/Back.png");

export default function ChangePassword({ navigation }) {
  const [isVer, setIsVer] = useState(false); // Para controlar qué paso mostrar
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");

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

  return (
    <ImageBackground source={image} style={styles.imgBackground}>
      {isVer != true ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Cambiar contraseña</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Código</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Código"
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity
            style={styles.btnIngresar}
            onPress={verificationUser}
          >
            <Text style={styles.txtBtn}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ width: "80%", gap: 20 }}>
            <Text style={styles.subtitle}>Escribe la nueva contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.subtitle}>
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
          <TouchableOpacity style={styles.btnIngresar} onPress={verification}>
            <Text style={styles.txtBtn}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Scale > 400 ? 24 : 20,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: Scale > 400 ? 18 : 14,
    marginLeft: "4%",
    color: "black",
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
  },
  imgBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
  },
  subtitleContainer: {
    alignItems: "flex-start",
    width: "90%",
  },
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    padding: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 10,
    alignSelf: "center",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    height: "8%",
    width: "40%",
    marginTop: "8%",
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
  },
});
