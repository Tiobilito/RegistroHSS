import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    TextInput,
    Alert,
    ImageBackground,
    TouchableOpacity,
    Platform,
  } from "react-native";
  import { useState } from "react";
  import { changePassword, checkUser } from "../Modulos/OperacionesBD";
  
  const Scale = Dimensions.get("window").width;
  
  const image = require("../assets/Back.png");
  
  export default function ChangePassword({ navigation }) {
    const [step, setStep] = useState(1); // Para controlar qué paso mostrar
    const [code, setCode] = useState("");
  
    const [password, setPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
  
    async function verificationUser() {
      const get = await checkUser(code);
      if (get == true) {
        ("");
        console.log("siiiii");
        setStep(2);
      } else {
        Alert.alert("El usuario no xiste:(");
      }
    }
    async function verification() {
      if (password === newPassword) {
        Alert.alert("las contrasenas son iguales");
        const changes = await changePassword(password, code);
        navigation.navigate("Ingreso");
      } else {
        Alert.alert("Las contrasenas no son iguales :(");
      }
    }
    return (
      <ImageBackground source={image} style={styles.imgBackground}>
        {step === 1 && (
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
                onChangeText={(text) => {
                  setCode(text);
                }}
              />
            </View>
  
            <TouchableOpacity
              style={styles.btnIngresar}
              onPress={() => verificationUser()}
            >
              <Text style={styles.txtBtn}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </>
        )}
        {step == 2 && (
          <>
            <View style={{ width: "80%", gap: "8%" }}>
              <Text style={styles.subtitle}>Escribe la nueva contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
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
                onChangeText={(text) => setnewPassword(text)}
              />
            </View>
            <TouchableOpacity style={styles.btnIngresar} onPress={() => verification()}>
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
      //marginRight: 30,
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
    formContainer: {
      width: "80%",
      justifyContent: "center",
      marginTop: "5%",
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: "10%",
      //backgroundColor: "red",
    },
    subtitleContainer: {
      alignItems: "flex-start",
      //backgroundColor: "green",
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
      //De aqui para abajo son las sombras para los distintos sistemas
      elevation: 15, //Android
      shadowColor: "#333333", //A partir de aqui ios
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    //Terminan las sombras
    btnContainer: {
      //backgroundColor: "green",
      alignItems: "center",
      marginTop: "4%",
    },
    btnIngresar: {
      backgroundColor: "#2272A7",
      height: "8%",
      width: "40%",
      marginTop: "8%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      elevation: 15, //Android
      shadowColor: "#333333", //A partir de aqui ios
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    btnRegistro: {
      backgroundColor: "#2272A7",
      height: "16%",
      width: 109,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: "8%",
      elevation: 15, //Android
      shadowColor: "#333333", //A partir de aqui ios
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    btnChangePass: {
      backgroundColor: "#2272A7",
      height: "16%",
      width: "70%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: "8%",
      elevation: 15, //Android
      shadowColor: "#333333", //A partir de aqui ios
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    separator: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      marginTop: "5%",
      marginBottom: "5%",
    },
    line: {
      height: 1,
      width: 120,
      backgroundColor: "black",
    },
  });