import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import db, { IniciarTiempoUsuario, añadirHoras } from "../Modulos/db";
import { Cronometro } from "../Modulos/Cronometro";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());

  const tomarUsuario = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Usuarios;`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            const usuario = rows._array[0];
            DefUsuario(usuario);
            if (usuario.Inicio) {
              DefMostrarCr(true);
              DefFechaInicio(new Date(usuario.Inicio));
            }
          } else {
            console.log("No hay Usuario");
          }
        },
        (_, error) => {
          console.log("Error al buscar el usuario:", error);
        }
      );
    });
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
            {usuario.Tipo}
          </Text>
          {MostrarCr ? (
            <View>
              <Button
                color="red"
                title="Detener tiempo"
                onPress={() => {
                  añadirHoras();
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
                onPress={() => {
                  const now = new Date();
                  DefFechaInicio(now);
                  IniciarTiempoUsuario(now.toISOString());
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
