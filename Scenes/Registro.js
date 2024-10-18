import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Pressable,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  AñadeUsuario,
  obtenerCentros,
  obtenerDepartamentos,
} from "../Modulos/OperacionesBD";
import { GuardarDatosUsuario } from "../Modulos/InfoUsuario";
import { CommonActions } from "@react-navigation/native";

const Scale = Dimensions.get("window").width;

export default function PaginaRegistro({ navigation }) {
  const [Nombre, DefNombre] = useState("");
  const [tipoUsuario, DeftipoUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const [codigo, DefCodigo] = useState(null);
  const [centros, setCentros] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);

  useEffect(() => {
    const fetchCentros = async () => {
      const data = await obtenerCentros();
      setCentros(data);
    };

    fetchCentros();
  }, []);

  useEffect(() => {
    if (selectedCentro && selectedCentro != "Selecciona una opción") {
      const fetchDepartamentos = async () => {
        const data = await obtenerDepartamentos(selectedCentro);
        setDepartamentos(data);
      };
      fetchDepartamentos();
    } else {
      setDepartamentos([]); // Cambiar null por un array vacío
    }
}, [selectedCentro]);

  const image = require("../assets/Back.png");

  return (
    <ImageBackground source={image} style={styles.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Registro</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <Text style={styles.subtitle}>Nombre</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefNombre(text);
          }}
          value={Nombre}
          placeholder="Nombre"
        />
        <Text style={styles.subtitle}>Código</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefCodigo(text);
          }}
          keyboardType="numeric"
          value={codigo}
          placeholder="Codigo"
        />
        <Text style={styles.subtitle}>Rol </Text>
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
        <Text style={styles.subtitle}>Centro Universitario</Text>
        <View style={{ width: 240, height: 150 }}>
          <Picker
            selectedValue={selectedCentro}
            itemStyle={styles.text}
            onValueChange={(itemValue) => {
              setSelectedCentro(itemValue);
              setSelectedDepartamento(null); // Reset the Departamento picker
            }}
          >
            <Picker.Item
              label="Selecciona una opción"
              value="Selecciona una opción"
            />
            {centros.map((centro) => (
              <Picker.Item
                key={centro.id}
                label={centro.Nombre}
                value={centro.id}
              />
            ))}
          </Picker>
        </View>
        {selectedCentro && selectedCentro !== "Selecciona una opción" && departamentos.length > 0 && (
          <>
            <Text style={styles.subtitle}>Selecciona un Departamento</Text>
            <View style={{ width: 240, height: 150 }}>
              <Picker
                selectedValue={selectedDepartamento}
                itemStyle={styles.text}
                onValueChange={(itemValue) =>
                  setSelectedDepartamento(itemValue)
                }
              >
                <Picker.Item
                  label="Selecciona una opción"
                  value="Selecciona una opción"
                />
                {departamentos.map((departamento) => (
                  <Picker.Item
                    key={departamento.id}
                    label={departamento.NombreDepartamento}
                    value={departamento.id}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}
        <Text style={styles.subtitle}>Contraseña </Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(text) => {
            DefContraseña(text);
          }}
          value={Contraseña}
          placeholder="Contraseña"
        />
        <Pressable
          style={styles.btnRegistro}
          onPress={() => {
            if (
              Nombre !== "" &&
              tipoUsuario !== "" &&
              codigo !== "" &&
              selectedCentro !== null &&
              selectedDepartamento !== null
            ) {
              if (codigo.length === 9) {
                AñadeUsuario(
                  Nombre.toUpperCase(),
                  tipoUsuario,
                  parseInt(codigo, 10),
                  Contraseña,
                  parseInt(selectedDepartamento, 10)
                );
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Ingreso" }],
                  })
                );
              } else {
                Alert.alert("Digite un codigo valido");
              }
            } else {
              Alert.alert("Por favor rellene todos los datos");
            }
          }}
        >
          <Text style={styles.txtBtn}>Registrar</Text>
        </Pressable>
      </ScrollView>
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
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  formContainer: {
    height: "50%",
    //marginBottom: "20%",
    width: "84%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
    marginTop: "55%",
    //backgroundColor: "green",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 50,
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
    alignItems: "center",

    backgroundColor: "yellow",
    width: "84%",
    height: "10%",
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    height: "20%",
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4%",
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
    height: "8%",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24%",
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
