import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button, Alert } from "react-native";
import { Cronometro } from "../Modulos/Cronometro";
import { ObtenerDatosUSB, IniciarTiempoUsuario, añadirHoras } from "../Modulos/OperacionesBD";
import { Gps, obtenerUbicacion } from "./gps";
import NetInfo from '@react-native-community/netinfo';

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());

  const [location, setLocation] = useState(null);
  const localizacion = "Blvd. Gral. Marcelino García Barragán 1421, Olímpica, 44840 Guadalajara, Jal., Mexico"
  const localizacion2 = "Centro Universitario de Ciencias Exactas e Ingenierías"
  let showAll = false
  const functionGetLocation = async () => {

    
      const location = await obtenerUbicacion()
      console.log(location)
       if(location === null){

        console.log("los datos son nulos")
        return false

       }else{
        console.log("los datos no son nulos")
        setLocation(location)
        return true
       }
          
  }


  const functionGetLocation2 = async () => {
    const location = await obtenerUbicacion();
    console.log('Resultado de obtenerUbicacion:', location);
    if (location === null) {
      console.log("los datos son nulos");
      return false;
    } else {
      console.log("los datos no son nulos");
      setLocation(location);
      return true;
    }
  };
  
  function network(){

    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
    });
  }
  function validation() {
    if (location[0].formattedAddress) {
      if (location[0].formattedAddress == localizacion) {
        console.log("esytas dentro de cucei")
        return true

      } else {

        console.log("no estas debtri de cucei ")
        return false
      }


    } else
      if (location[0].name) {

        if (location[0].name == localizacion2) {
          console.log("esytas dentro de cucei")
          return true
        }
        else {

          console.log("no estas debtri de cucei ")

          return false
        }
      }
  }


  const tomarUsuario = async () => {
    const DatosUsuario = await ObtenerDatosUSB();
    if (DatosUsuario && DatosUsuario.length > 0) {
      const usuarioDatos = DatosUsuario[0];
      DefUsuario(usuarioDatos);
      if (usuarioDatos.Inicio) {
        DefFechaInicio(new Date(usuarioDatos.Inicio));
        DefMostrarCr(true);
      }
    }
  };
    if (usuario && location) {
        showAll = true
      }


  useEffect(() => {
    network()
    tomarUsuario();
    functionGetLocation()
  

  }, []);

  return (
    <View style={styles.container}>
      {showAll ? (
        <View>
          <Text style={styles.text}>
            Hola {usuario.Nombre} a la app de registro de horas para{" "}
            {usuario.TipoServidor}
          </Text>
          {MostrarCr ? (
            <View>
              <Button
                color="red"
                title="Detener tiempo"
                onPress={async () => {
                 const getLocation=await functionGetLocation()
                 if(getLocation===true){
                  if (validation()) {

                    añadirHoras(usuario.Codigo);
                    DefMostrarCr(false);
                  }
                  else {
                    Alert.alert("no estas en CUCEI :(")
                  }}
                  else{

                    Alert.alert("debes tener la ubicacion activada para detener el boton")
                  }
                  

                }}
              />
              <Cronometro startDate={FechaInicio} />
            </View>
          ) : (
            <View>
              <Button
                color="blue"
                title="Iniciar tiempo"
                onPress={async() => {
                  const now = new Date();
                 const obt=await functionGetLocation()
                console.log(obt)
                  
                 if(obt===true) {
                  console.log("sise puede")
                  if (validation()) {

                    DefFechaInicio(now);
                    IniciarTiempoUsuario(now.toISOString(), usuario.Codigo);
                    DefMostrarCr(true);
                  }
                  else {

                    Alert.alert("no estas dentro de CUCEI :(")
                  }}

                  else{

                    console.log("no se puede")
                  }
                  




                }}
              />
            </View>
          )}
        </View>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Content: {
    margin: 50,
  },
  Boton: {
    color: "red",
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    margin: 20,
    color: "black",
  },
});
