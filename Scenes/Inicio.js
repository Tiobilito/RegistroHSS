import { React, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import db, { AñadeUsuario } from "../Modulos/db";
import PagerView from "react-native-pager-view";
import { Picker } from "@react-native-picker/picker";
import { CommonActions } from "@react-navigation/native";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const [Nombre, DefNombre] = useState("");
  const [tipoUsuario, DeftipoUsuario] = useState("");
  const [codigo, DefCodigo] = useState(null);
  const ref = useRef();

  const GuardarCodigo = async () => {
    try {
      await AsyncStorage.setItem("Codigo-Usuario", codigo);
      console.log("Codigo: ", codigo);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.background}>
      <PagerView style={styles.pager} ref={ref} initialPage={0}>
        <View key="1" style={styles.container}>
          <Text style={styles.text}>
            {
              "Hola aspirante, registra tu usuario y desliza para procegir con el registro\n Solo tienes que hacer este proceso 1 vez \n\n"
            }
          </Text>
          <Text style={styles.text}>Escribe tu nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefNombre(text);
            }}
            value={Nombre}
            placeholder="Nombre"
          />
        </View>
        <View key="2">
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              const ValorEnt = parseInt(text, 10);
              if (!isNaN(ValorEnt)) {
                DefCodigo(ValorEnt);
              } else if (text === "") {
                DefCodigo(null);
              }
            }}
            value={codigo !== null ? codigo.toString() : ""}
          />
        </View>
        <View key="3" style={styles.container}>
          <Text style={styles.text}>Selecciona un rol </Text>
          <View style={{ width: 240, height: 150 }}>
            <Picker
              selectedValue={tipoUsuario}
              itemStyle={styles.text}
              onValueChange={(itemValue) => DeftipoUsuario(itemValue)}
            >
              <Picker.Item
                label="Selecciona una opción"
                value="Selecciona una opción"
              />
              <Picker.Item
                label="Prestador de servicio"
                value="Prestador de servicio"
              />
              <Picker.Item label="Practicante" value="Practicante" />
            </Picker>
          </View>
        </View>
        <View key="4" style={styles.container}>
          <Button
            title="Listo"
            onPress={() => {
              if (Nombre != "" && tipoUsuario != "") {
                GuardarCodigo(codigo);
                //AñadeUsuario(Nombre, tipoUsuario);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Tab" }],
                  })
                );
              } else {
                Alert.alert("Por favor rellene todos los datos");
              }
            }}
          />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: Scale > 400 ? 60 : 40,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    width: "80%",
    fontSize: Scale > 400 ? 30 : 15,
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 20,
    color: "black",
  },
  pager: {
    flex: 1,
    alignSelf: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});