import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import db from "../Modulos/db";
import { Cronometro } from "../Modulos/Cronometro";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, setUsuario] = useState(null);
  const startDate = new Date(); 

  const tomarUsuario = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Usuarios;`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setUsuario(rows._array[0]);
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
          <Button
            title="Iniciar tiempo"
            onPress={() => {
              console.log("espere funcionalidad");
            }}
          />
          <Cronometro startDate={startDate} />
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
    margin: 50
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    margin: 20,
    color: "black",
  },
});
