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
  useWindowDimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AñadeUsuario } from "../Modulos/Operaciones Supabase/UsuariosSupa";
import { obtenerCentros, obtenerDepartamentos } from "../Modulos/Operaciones Supabase/Departamentos";
import { CommonActions } from "@react-navigation/native";
import * as Crypto from 'expo-crypto';
import Icon from 'react-native-vector-icons/FontAwesome';

// Función para hashear la contraseña
const hashPassword = async (password) => {
  try {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hashedPassword;
  } catch (error) {
    console.error("Error al hashear la contraseña: ", error);
    return null;
  }
};

const Scale = Dimensions.get("window").width;

export default function PaginaRegistro({ navigation }) {
  const [Correo, DefCorreo] = useState("");
  const { width, height } = useWindowDimensions(); // Hook para responsividad
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
    <ImageBackground
      source={image}
      // Se reemplaza la asignación de dimensiones para que el fondo ocupe el 100% de la pantalla
      style={[styles.background, { width: "100%", height: "100%" }]}
      resizeMode="cover"
    >
      {/* Título "Registro" posicionado más arriba */}
      <View
        style={[
          styles.titleContainer,
          { marginTop: height * 0.25, marginBottom: height * 0.02 } // Se ubica más arriba
        ]}
      >
        <Text style={styles.title}>Registro</Text>
      </View>
      
      {/* Contenedor para el ScrollView, ahora posicionado más arriba */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start", // Se alinea al inicio
          alignItems: "center",
          width: width,
          marginTop: height * 0.02 // Margen superior pequeño para separar del título
        }}
      >
        <ScrollView
          style={[
            styles.formContainer,
            {
              width: width * 0.84,
              height: height * 0.5,
              marginBottom: height * 0.05 // Espacio entre el ScrollView y el final de la pantalla
            }
          ]}
        >
          <View style={styles.section}>
            <Icon name="user" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Nombre</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefNombre(text);
            }}
            value={Nombre}
            placeholder="Nombre"
          />
          <View style={styles.section}>
            <Icon name="id-badge" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Código</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefCodigo(text);
            }}
            keyboardType="numeric"
            value={codigo}
            placeholder="Codigo"
          />
          <View style={styles.section}>
            <Icon name="envelope" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Correo Electrónico</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => DefCorreo(text)}
            value={Correo}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
          />
          <View style={styles.section}>
            <Icon name="shield" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Rol </Text>
          </View>
          <View
            style={[
              { width: 240, height: 150 },
              { width: width * 0.65, height: height * 0.07 } // Se reduce la altura de 0.25 a 0.07
            ]}
          >
            <Picker
              selectedValue={tipoUsuario}
              itemStyle={styles.text}
              onValueChange={(itemValue) => DeftipoUsuario(itemValue)}
            >
              <Picker.Item label="Selecciona una opción" value="Selecciona una opción" />
              <Picker.Item label="Prestador de servicio" value="Prestador de servicio" />
              <Picker.Item label="Practicante" value="Practicante" />
            </Picker>
          </View>
          <View style={[styles.section, { alignItems: "center" }]}>
            <Icon name="building" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Centro Universitario</Text>
          </View>
          <View
            style={[
              { width: 240, height: 150 },
              { width: width * 0.65, height: height * 0.07 } // Se reduce la altura de 0.25 a 0.07
            ]}
          >
            <Picker
              selectedValue={selectedCentro}
              itemStyle={styles.text}
              onValueChange={(itemValue) => {
                setSelectedCentro(itemValue);
                setSelectedDepartamento(null); // Reset the Departamento picker
              }}
            >
              <Picker.Item label="Selecciona una opción" value="Selecciona una opción" />
              {centros.map((centro) => (
                <Picker.Item key={centro.id} label={centro.Nombre} value={centro.id} />
              ))}
            </Picker>
          </View>
          {selectedCentro &&
            selectedCentro !== "Selecciona una opción" &&
            departamentos.length > 0 && (
              <>
              <View style={[styles.section, { alignItems: "center" }]}>
                <Icon name="sitemap" size={20} color="#2272A7" style={styles.icon} />
                  <Text style={styles.subtitle}>Selecciona un Departamento</Text>
              </View>
                <View
                  style={[
                    { width: 240, height: 150 },
                    { width: width * 0.65, height: height * 0.07 } // Se adapta responsivamente
                  ]}
                >
                  <Picker
                    selectedValue={selectedDepartamento}
                    itemStyle={styles.text}
                    onValueChange={(itemValue) =>
                      setSelectedDepartamento(itemValue)
                    }
                  >
                    <Picker.Item label="Selecciona una opción" value="Selecciona una opción" />
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
          <View style={styles.section}>
            <Icon name="key" size={20} color="#2272A7" style={styles.icon} />
              <Text style={styles.subtitle}>Contraseña </Text>
          </View>
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
            style={[
              styles.btnRegistro,
              {
                width: width * 0.4,
                height: height * 0.06, // Se reduce la altura del botón (antes: height * 0.08)
                marginBottom: height * 0.04, // Espaciado responsivo
                alignSelf: "center" // Centra el botón horizontalmente
              },
            ]}
            onPress={async () => {
              if (
                Nombre !== "" &&
                tipoUsuario !== "" &&
                codigo !== "" &&
                selectedCentro !== null &&
                selectedDepartamento !== null &&
                Correo !== ""
              ) {
                const emailRegex = /^[^\s@]+@alumnos\.udg\.mx$/;
                if (!emailRegex.test(Correo)) {
                  Alert.alert("El correo debe pertenecer a alumnos.udg.mx");
                  return;
                }
                if (codigo.length === 9) {
                  // Hasheando la contraseña
                  const hashedPassword = await hashPassword(Contraseña);
                  AñadeUsuario(
                    Nombre.toUpperCase(),
                    tipoUsuario,
                    parseInt(codigo, 10),
                    hashedPassword, // Usamos la contraseña hasheada
                    parseInt(selectedDepartamento, 10),
                    Correo.toLowerCase() // Asegurar que el correo sea en minúsculas
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginTop: -40,
  },
  subtitle: {
    fontSize: 16,
    marginLeft: "4%",
    marginTop: 5,
    marginBottom: 5,
    color: "black",
    fontWeight: "600",
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 20,
    padding: 20,
    alignSelf: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
    marginTop: "55%",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    marginVertical: 8,
    backgroundColor: "#C5E0F2",
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
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
    elevation: 15,
    shadowColor: "#333333",
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
    elevation: 15,
    shadowColor: "#333333",
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
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
});
