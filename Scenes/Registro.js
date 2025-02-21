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

const Scale = Dimensions.get("window").width;

export default function PaginaRegistro({ navigation }) {
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
              marginBottom: height * 0.10 // Espacio entre el ScrollView y el final de la pantalla
            }
          ]}
        >
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
          <Text style={styles.subtitle}>Centro Universitario</Text>
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
                <Text style={styles.subtitle}>Selecciona un Departamento</Text>
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
            style={[
              styles.btnRegistro,
              {
                width: width * 0.4,
                height: height * 0.06, // Se reduce la altura del botón (antes: height * 0.08)
                marginBottom: height * 0.04, // Espaciado responsivo
                alignSelf: "center" // Centra el botón horizontalmente
              },
            ]}
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
      </View>
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
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Se eliminó resizeMode aquí ya que se especifica en la prop resizeMode del ImageBackground
  },
  formContainer: {
    height: "50%",
    width: "84%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
    marginTop: "55%",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 50,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
});
