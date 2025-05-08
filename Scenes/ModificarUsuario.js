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
import * as Crypto from "expo-crypto"; // Importar hashing
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los íconos

export default function PaginaModUsuario({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  const [Nombre, DefNombre] = useState("");
  const [tipoUsuario, DeftipoUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const [codigo, DefCodigo] = useState(null);
  const [centros, setCentros] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [correo, setCorreo] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [buttonYPosition, setButtonYPosition] = useState(0); // Para calcular la posición del botón
  const [scrollHeight, setScrollHeight] = useState(0); // Para controlar la altura del ScrollView

  const DefDatosUsuario = async () => {
    const dataL = await ObtenerDatosUsuario();
    const data = await ObtenerDatosUsuarioSupa(dataL.Codigo);
    if (data) {
      DefNombre(data.Nombre);
      DefCodigo(data.Codigo.toString());
      DeftipoUsuario(data.TipoServidor);
      DefContraseña(data.Contraseña);
      setOriginalPassword(data.Contraseña);
      setCorreo(data.Correo);
      DefContraseña(""); // No mostrar la contraseña hasheada
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

  const handleButtonLayout = (event) => {
    const { y } = event.nativeEvent.layout;
    setButtonYPosition(y);
  };

  const handleContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setScrollHeight(height);
  };

  const image = require("../assets/Back.png");

  return (
    <ImageBackground
      source={image}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <View style={[styles.titleContainer, { marginTop: height * 0.18, marginBottom: height * 0.03 }]}>
        <Text style={[styles.title, { fontSize: scaleFactor > 1 ? 30 : 28 }]}>
          Editar usuario
        </Text>
      </View>
      <View style={{ height: 500, width: width * 0.84 }}>
      <ScrollView
        contentContainerStyle={[
          styles.formContainer,
          { 
            width: width * 0.84,
            flexGrow: 1 // <- esto es CLAVE para limitar el scroll al contenido real
          }
        ]}
        onLayout={handleContentLayout}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <View style={styles.section}>
          <Icon name="user" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14 }]}>Nombre</Text>
        </View>
        <TextInput
          style={[styles.input, { fontSize: 16 * scaleFactor }]}
          onChangeText={(text) => DefNombre(text)}
          value={Nombre}
          placeholder="Nombre"
        />

        <View style={styles.section}>
          <Icon name="id-badge" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14 }]}>Código</Text>
        </View>
        <Text style={{ fontSize: 24 * scaleFactor, marginLeft: "4%", color: "black" }}>
          {codigo}
        </Text>

        <View style={styles.section}>
          <Icon name="envelope" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14 }]}>Correo</Text>
        </View>
        <TextInput
          style={[styles.input, { fontSize: 16 * scaleFactor }]}
          onChangeText={(text) => setCorreo(text)}
          value={correo}
          placeholder="Correo electrónico"
        />

        <View style={styles.section}>
          <Icon name="shield" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginBottom: 5 }]}>
            Rol
          </Text>
        </View>
        <View style={{ width: 240 * (width / 375), height: 80 * (height / 667) }}>
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

        <View style={[styles.section, { alignItems: "center" }]}>
          <Icon name="building" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -30 }]}>
            Centro Universitario
          </Text>
        </View>
        <View style={{ width: 240 * (width / 375), height: 80 * (height / 667) }}>
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
              <View style={[styles.section, { alignItems: "center" }]}>
                <Icon name="sitemap" size={20} color="#2272A7" style={styles.icon} />
                <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -30 }]}>
                  Selecciona un Departamento
                </Text>
              </View>
              <View style={{ width: 240 * (width / 375), height: 80 * (height / 667) }}>
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

        <View style={styles.section}>
          <Icon name="key" size={20} color="#2272A7" style={styles.icon} />
          <Text style={[styles.subtitle, { fontSize: scaleFactor > 1 ? 18 : 14, marginTop: -30 }]}>
            Contraseña
          </Text>
        </View>
        <TextInput
          style={[styles.input, { fontSize: 16 * scaleFactor }]}
          secureTextEntry={true}
          onChangeText={(text) => DefContraseña(text)}
          value={Contraseña}
          placeholder="Contraseña"
        />

        <Pressable
          style={[styles.btnRegistro, { marginBottom: 20 }]}
          onPress={async () => {
            if (
              Nombre !== "" &&
              tipoUsuario !== "" &&
              codigo !== "" &&
              selectedCentro !== null &&
              selectedDepartamento !== null
            ) {
              if (codigo.length === 9) {
                let passwordToSend = Contraseña;

                if (Contraseña !== originalPassword) {
                  passwordToSend = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.SHA256,
                    Contraseña
                  );
                }
                await ModificaUsuario(
                  Nombre.toUpperCase(),
                  tipoUsuario,
                  parseInt(codigo, 10),
                  passwordToSend,
                  parseInt(selectedDepartamento, 10),
                  correo
                );
                navigation.goBack();
              } else {
                Alert.alert("Digite un código válido");
              }
            } else {
              Alert.alert("Por favor rellene todos los datos, o cancele");
            }
          }}
          onLayout={handleButtonLayout}
        >
          <Text style={[styles.txtBtn, { fontSize: 16 * scaleFactor }]}>Modificar</Text>
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
    textAlign: "center",
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
  pickerContainer: {
    backgroundColor: "#C5E0F2",
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: "4%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  btnRegistro: {
    backgroundColor: "#2272A7",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    alignSelf: "center",
    marginTop: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
});
