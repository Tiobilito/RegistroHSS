import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/OperacionesBD";

import { Gps,obtenerUbicacion } from "./gps";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const [Codigo, DefCodigo] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const [location , setLocation] = useState(null);
  const [locationIphone, setLocationIphone] = useState(null)
  const localizacion="Blvd. Gral. Marcelino García Barragán 1421, Olímpica, 44840 Guadalajara, Jal., Mexico"

  
  const IngresoUsuario = async () => {
    const BUsuario = await EncontrarUsuario(Codigo, Contraseña);
   
    if (BUsuario === true) 
      {
       //const getLocation1=await obtenerUbicacion()
       
       //setLocation(getLocation1)

       //if(getLocation1){
        navigation.dispatch( 
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Tab" }],
        })
      );
      // }else{

        console.log("no puedo tener tu ubicacion :(")
     //  }
       
      
    } else {
      console.log("No existe el usuario");
    }
  };

  const checarUsuario = async () => {
    try {
      const data = await ObtenerDatosUsuario();
      if (data) {
        if(Codigo === "") {
          DefCodigo(data.Codigo);
        }
        if(Contraseña === "") {
          DefContraseña(data.Contraseña);
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario: ", error);
    }
  };

  useEffect(()=>{

    checarUsuario()
  })

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ingresa</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          DefCodigo(text);
        }}
        value={Codigo}
        placeholder="Codigo"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          DefContraseña(text);
        }}
        value={Contraseña}
        placeholder="Contraseña"
        secureTextEntry={true}
      />
      <Button
        color="blue"
        title="Ingresar"
        onPress={() => {
          if (Codigo != "" && Contraseña != "") {
            IngresoUsuario();
          } else {
            Alert.alert("Por favor completa los 2 campos");
          }
        }}
      />
      <Button
        color="red"
        title="Registro"
        onPress={() => {
         navigation.navigate("Registro")
        }}
      />

      <Button
      color="orange"
      title="change password"
      onPress={()=>{
        navigation.navigate("changepassword")
       } }/>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 20,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%", // Para que el input tenga un ancho razonable
  },
});
