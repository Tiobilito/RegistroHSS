import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AñadeUsuario, obtenerCentros, obtenerDepartamentos } from "../Modulos/OperacionesBD";
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
    if (selectedCentro) {
      const fetchDepartamentos = async () => {
        const data = await obtenerDepartamentos(selectedCentro);
        setDepartamentos(data);
      };

      fetchDepartamentos();
    }
  }, [selectedCentro]);

  return (
    <View style={styles.background}>
      <ScrollView>
        <Text style={styles.text}>Hola aspirante, registra tu usuario</Text>
        <Text style={styles.text}>Escribe tu nombre</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefNombre(text);
          }}
          value={Nombre}
          placeholder="Nombre"
        />
        <Text style={styles.text}>Escribe tu Codigo</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefCodigo(text);
          }}
          keyboardType="numeric"
          value={codigo}
          placeholder="Codigo"
        />
        <Text style={styles.text}>Selecciona un rol </Text>
        <View style={{ width: 240, height: 150 }}>
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
        <Text style={styles.text}>Selecciona un Centro Universitario</Text>
        <View style={{ width: 240, height: 150 }}>
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
        {selectedCentro && (
          <>
            <Text style={styles.text}>Selecciona un Departamento</Text>
            <View style={{ width: 240, height: 150 }}>
              <Picker
                selectedValue={selectedDepartamento}
                itemStyle={styles.text}
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
        <Text style={styles.text}>Escribe tu contraseña </Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={(text) => {
            DefContraseña(text);
          }}
          value={Contraseña}
          placeholder="Contraseña"
        />
        <Button
          title="Listo"
          onPress={() => {
            if (Nombre !== "" && tipoUsuario !== "" && codigo !== "" && selectedCentro !== null && selectedDepartamento !== null) {
              if (codigo.length === 9) {
                AñadeUsuario(
                  Nombre.toUpperCase(),
                  tipoUsuario,
                  parseInt(codigo, 10),
                  Contraseña,
                  parseInt(selectedDepartamento, 10) // Ensure selectedDepartamento is used correctly
                );
                GuardarDatosUsuario(parseInt(codigo, 10), Contraseña);
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
        />
      </ScrollView>
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
    margin: 10,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
