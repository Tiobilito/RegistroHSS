import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button, Alert } from "react-native";
import { añadirHoras } from "../Modulos/db";
import { ObtenerDatosUsuario, ActualizarInicio } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import { functionGetLocation, validation } from "../Modulos/gps";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [Ubicacion, DefUbicacion] = useState(null);

  const tomarUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      DefUsuario(data);
      if (data.Inicio != "null") {
        DefFechaInicio(new Date(data.Inicio));
        DefMostrarCr(true);
      }
    } else {
      console.log("No hay Usuario");
    }
  };

  useEffect(() => {
    tomarUsuario();
    functionGetLocation(DefUbicacion);
  }, []);

  return (
    <View style={styles.container}>
      {usuario ? (
        <View>
          <Text style={styles.text}>
            Hola {usuario.Nombre} a la app de registro de horas para{" "}
            {usuario.Tipo}
          </Text>
          {MostrarCr ? (
            <View>
              <Button
                color="red"
                title="Detener tiempo"
                onPress={async () => {
                  const VLocation = await functionGetLocation(DefUbicacion);
                  if (VLocation === true) {
                    if (await validation(Ubicacion)) {
                      añadirHoras();
                      DefMostrarCr(false);
                    } else {
                      Alert.alert("No estas en el departamento :(");
                    }
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
                  const VLocation = await functionGetLocation(DefUbicacion);
                  if (VLocation === true) {
                    if (await validation(Ubicacion)) {
                      DefFechaInicio(now);
                      ActualizarInicio(now.toISOString());
                      DefMostrarCr(true);
                    } else {
                      Alert.alert("No estas dentro del Departamento :(");
                    }
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
