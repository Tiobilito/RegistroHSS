import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import { Cronometro } from "../Modulos/Cronometro";
import {
  ObtenerDatosUSB,
  IniciarTiempoUsuario,
  añadirHoras,
} from "../Modulos/OperacionesBD";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());

  const tomarUsuario = async () => {
    const DatosUsuario = await ObtenerDatosUSB();
    if (DatosUsuario && DatosUsuario.length > 0) {
      DefUsuario(DatosUsuario[0]);
      if (DatosUsuario[0].Inicio) {
        DefFechaInicio(new Date(usuarioDatos.Inicio));
        DefMostrarCr(true);
      }
    }
  };

  useEffect(() => {
    tomarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      {usuario ? (
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
                  await añadirHoras();
                  DefMostrarCr(false);
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
                  DefFechaInicio(now);
                  await IniciarTiempoUsuario(now.toISOString());
                  DefMostrarCr(true);
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
