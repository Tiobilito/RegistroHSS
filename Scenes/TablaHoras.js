import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Scale,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import db from "../Modulos/db";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

export default function PaginaTablaHoras() {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  const obtenerHoras = async () => {
    const User = await ObtenerDatosUsuario();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Horas WHERE idUsuario = ?;`,
        [User.Codigo],
        (_, { rows }) => {
          DefHoras(rows._array);
          DefMostrarHoras(rows._array.length > 0);
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
          //gap: 4,
        }}
      >
        <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "bold" }}>
          Tabla de registros
        </Text>
        <Text
          style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "regular" }}
        >
          Horas formato de total HH:MM:SS
        </Text>
      </View>
      <View style={styles.listContainer}>
        {MostrarHoras ? (
          <FlatList
            data={Horas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                {item.IsBackedInSupabase == 0 ? (
                  <Ionicons name="cloud-offline" size={30} color="black" />
                ) : (
                  <Ionicons name="cloud" size={30} color="white" />
                )}
                <Text style={styles.txt}>Inicio: {item.Inicio}</Text>
                <Text style={styles.txt}>Final: {item.Final}</Text>
                <Text style={styles.txt}>Total: {item.Total}</Text>
              </View>
            )}
          />
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
    // width: "100%",
    // height: "20%",
    borderRadius: 20,
    // //borderColor: "white",
    marginBottom: "8%",
    //gap: "12%",
    // //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
