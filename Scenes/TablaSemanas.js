import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Scale,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import db, { sumarTiempos } from "../Modulos/db";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

export default function PaginaTablaSemanas({ navigation }) {
  const [Horas, DefHoras] = useState([]);
  const [Semanas, DefSemanas] = useState([]);
  const [MostrarSemanas, DefMostrarSemanas] = useState(false);

  const obtenerHoras = async () => {
    const User = await ObtenerDatosUsuario();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Horas WHERE idUsuario = ?;`,
        [User.Codigo],
        (_, { rows }) => {
          DefHoras(rows._array);
        },
        (_, error) => {
          console.log("Error al obtener las horas:", error);
          return true; // Indica que el error fue manejado
        }
      );
    });
  };

  const obtenerSemanas = async () => {
    const User = await ObtenerDatosUsuario();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Semanas WHERE idUsuario = ?;`,
        [User.Codigo],
        (_, { rows }) => {
          DefSemanas(rows._array);
          DefMostrarSemanas(rows._array.length > 0);
        },
        (_, error) => {
          console.log("Error al obtener las horas:", error);
          return true; // Indica que el error fue manejado
        }
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerSemanas();
      obtenerHoras();
    }, [])
  );

  const image = require("../assets/fondo.png");

  return (
    <ImageBackground source={image} style={styles.container}>
      <View
        style={{
          width: "90%",
          marginTop: "8%",
        }}
      >
        <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "bold" }}>
          Tabla de semanas
        </Text>
        <Text
          style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "regular" }}
        >
          Horas formato de total HH:MM:SS
        </Text>
      </View>
      <View style={styles.listContainer}>
        {MostrarSemanas ? (
          <>
            <FlatList
              data={Semanas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TablaHoras", {
                      idSem: item.id,
                    });
                  }}
                >
                  <View style={styles.item}>
                    <Text style={styles.txt}>
                      {item.Inicio} - {item.Fin}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", width: 'auto'}}>
                Total acumulado: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
            </View>
          </>
        ) : (
          <Text>No hay registros</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  txtMain: {
    color: "white",
    fontWeight: "bold",
  },
  txt: {
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  item: {
    backgroundColor: "#2272A7",
    borderRadius: 15,
    marginBottom: "8%",
    // //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    padding: 10,
  },
  listContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "70%",
    borderRadius: 20,
    marginTop: "8%",
    padding: "4%",
    //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
