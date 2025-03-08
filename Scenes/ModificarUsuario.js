import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ModificaUsuario, ObtenerDatosUsuarioSupa } from "../Modulos/Operaciones Supabase/UsuariosSupa";
import { obtenerDepartamentos, obtenerCentros } from "../Modulos/Operaciones Supabase/Departamentos";


import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

export default function PaginaModUsuario({ navigation }) {
  const { width, height } = useWindowDimensions();
  // Factor de escala basado en un ancho base de 375
  const scaleFactor = width / 375;

  const [Nombre, DefNombre] = useState("");
  const [tipoUsuario, DeftipoUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const [codigo, DefCodigo] = useState(null);
  const [centros, setCentros] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);

  const DefDatosUsuario = async () => {
    const dataL = await ObtenerDatosUsuario();
    const data = await ObtenerDatosUsuarioSupa(dataL.Codigo);
    if (data) {
      DefNombre(data.Nombre);
      DefCodigo(data.Codigo.toString());
      DeftipoUsuario(data.TipoServidor);
      DefContraseña(data.Contraseña);
    }
  };

  const fetchCentros = async () => {
    const data = await obtenerCentros();
    setCentros(data);
  };

  useEffect(() => {
    DefDatosUsuario();
    fetchCentros();
  }, []);

  useEffect(() => {
    if (selectedCentro && selectedCentro !== "Selecciona una opción") {
      const fetchDepartamentos = async () => {
        const data = await obtenerDepartamentos(selectedCentro);
        setDepartamentos(data);
      };
      fetchDepartamentos();
    } else {
      setDepartamentos([]);
    }
  }, [selectedCentro]);

  const image = require("../assets/Back.png");

  return (
    <ImageBackground
      source={image}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      {/* Contenedor del título */}
      <View
        style={[
          styles.titleContainer,
          { marginTop: height * 0.25, marginBottom: height * 0.05 },
        ]}
      >
        <Text style={[styles.title, { fontSize: scaleFactor > 1 ? 30 : 28 }]}>
          Editar usuario
        </Text>
      </View>

      <ScrollView
        style={[styles.formContainer, { width: width * 0.84, height: height * 0.55 }]}
      >
        <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14 }]}>
          Nombre
        </Text>
        <TextInput
          style={[styles.input, { fontSize: 16 * scaleFactor }]}
          onChangeText={(text) => DefNombre(text)}
          value={Nombre}
          placeholder="Nombre"
        />

        <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14 }]}>
          Código
        </Text>
        <Text
          style={{
            fontSize: 24 * scaleFactor,
            marginLeft: "4%",
            color: "black",
          }}
        >
          {codigo}
        </Text>

        <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginBottom: 5 }]}>
          Rol
        </Text>
        {/* Se reduce la altura del contenedor del Picker para Rol */}
        <View
          style={{
            width: 240 * (width / 375),
            height: 80 * (height / 667), // Reducido de 100 a 80
          }}
        >
          <Picker
            selectedValue={tipoUsuario}
            itemStyle={[styles.text, { fontSize: 16 * scaleFactor }]}
            onValueChange={(itemValue) => DeftipoUsuario(itemValue)}
          >
            <Picker.Item label="Selecciona una opción" value="Selecciona una opción" />
            <Picker.Item label="Prestador de servicio" value="Prestador de servicio" />
            <Picker.Item label="Practicante" value="Practicante" />
          </Picker>
        </View>

        <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -40 }]}>
          Centro Universitario
        </Text>
        {/* Reducir también la altura del contenedor del Picker para Centro Universitario */}
        <View
          style={{
            width: 240 * (width / 375),
            height: 80 * (height / 667), // Reducido de 100 a 80
          }}
        >
          <Picker
            selectedValue={selectedCentro}
            itemStyle={[styles.text, { fontSize: 16 * scaleFactor }]}
            onValueChange={(itemValue) => {
              setSelectedCentro(itemValue);
              setSelectedDepartamento(null);
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
              <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -40 }]}>
                Selecciona un Departamento
              </Text>
              <View
                style={{
                  width: 240 * (width / 375),
                  height: 80 * (height / 667), // Reducido de 100 a 80
                }}
              >
                <Picker
                  selectedValue={selectedDepartamento}
                  itemStyle={[styles.text, { fontSize: 16 * scaleFactor }]}
                  onValueChange={(itemValue) => setSelectedDepartamento(itemValue)}
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

        <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -40 }]}>
          Contraseña
        </Text>
        <TextInput
          style={[styles.input, { fontSize: 16 * scaleFactor }]}
          secureTextEntry={true}
          onChangeText={(text) => DefContraseña(text)}
          value={Contraseña}
          placeholder="Contraseña"
        />

        <Pressable
          style={[styles.btnRegistro, { marginBottom: height * 0.24 }]}
          onPress={() => {
            if (
              Nombre !== "" &&
              tipoUsuario !== "" &&
              codigo !== "" &&
              selectedCentro !== null &&
              selectedDepartamento !== null
            ) {
              if (codigo.length === 9) {
                ModificaUsuario(
                  Nombre.toUpperCase(),
                  tipoUsuario,
                  parseInt(codigo, 10),
                  Contraseña,
                  parseInt(selectedDepartamento, 10)
                );
                navigation.goBack();
              } else {
                Alert.alert("Digite un código válido");
              }
            } else {
              Alert.alert("Por favor rellene todos los datos, o cancele");
            }
          }}
        >
          <Text style={[styles.txtBtn, { fontSize: 16 * scaleFactor }]}>
            Modificar
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 18,
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
    width: "84%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 50,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 6 },
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignSelf: "center",
  },
});
