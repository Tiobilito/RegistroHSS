import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import { Cronometro } from "../Modulos/Cronometro";
import {
  ObtenerDatosUSB,
  IniciarTiempoUsuario,
  añadirHoras,
} from "../Modulos/OperacionesBD";
import { functionGetLocation, validation } from "../Modulos/gps";
import NetInfo from "@react-native-community/netinfo";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [location, setLocation] = useState(null);
  let showAll = false;

  function network() {
    NetInfo.fetch().then((state) => {
      console.log("Esta connectado?: ", state.isConnected);
    });
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
    showAll = true;
  }

  useEffect(() => {
    network();
    tomarUsuario();
    functionGetLocation(setLocation);
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
                  const VLocation = await functionGetLocation(setLocation);
                  if (VLocation === true) {
                    if (validation(location)) {
                      añadirHoras(usuario.Codigo);
                      DefMostrarCr(false);
                    } else {
                      Alert.alert("No estas en CUCEI :(");
                    }
                  } else {
                    Alert.alert(
                      "Debes tener la ubicacion activada para detener el boton"
                    );
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
                onPress={async () => {
                  const now = new Date();
                  const VLocation = await functionGetLocation(setLocation);
                  if (VLocation === true) {
                    console.log("Estas dentro de CUCEI");
                    if (validation(location)) {
                      DefFechaInicio(now);
                      IniciarTiempoUsuario(now.toISOString(), usuario.Codigo);
                      DefMostrarCr(true);
                    } else {
                      Alert.alert("No estas dentro de CUCEI :(");
                    }
                  } else {
                    Alert.alert(
                      "Debes tener la ubicacion activada para detener el boton"
                    );
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
