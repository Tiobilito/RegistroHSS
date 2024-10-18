import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import db, { sumarTiempos } from "../Modulos/db";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

const Scale = Dimensions.get("window").width;

export default function PaginaTablaSemanas({ navigation }) {
  const [Horas, DefHoras] = useState([]);
  const [Semanas, DefSemanas] = useState([]);
  const [MostrarSemanas, DefMostrarSemanas] = useState(false);
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);

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
          return true;
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
          console.log("Error al obtener las semanas:", error);
          return true;
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

  const handleCheckboxChange = (idSem) => {
    setSemanasSeleccionadas((prevSeleccionadas) =>
      prevSeleccionadas.includes(idSem)
        ? prevSeleccionadas.filter((id) => id !== idSem)
        : [...prevSeleccionadas, idSem]
    );
  };

  const calcularTotalSeleccionado = () => {
    const horasSeleccionadas = Horas.filter((hora) =>
      semanasSeleccionadas.includes(hora.idSemana)
    );
    return sumarTiempos(horasSeleccionadas.map((item) => item.Total));
  };

  const image = require("../assets/fondo.png");

  return (
    <ImageBackground source={image} style={styles.container}>
      <View
        style={{
          width: "90%",
          marginTop: "8%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "bold" }}>
          Tabla de semanas
        </Text>
        {/* Botón Refresh */}
        <Pressable
          onPress={() => setSemanasSeleccionadas([])} // Deselecciona todo
          disabled={semanasSeleccionadas.length === 0} // Deshabilita si no hay seleccionadas
          style={{marginLeft:40}}
        >
          <Ionicons
            name="refresh-circle"
            size={70}
            color={semanasSeleccionadas.length === 0 ? "gray" : "black"} // Color gris si está deshabilitado
          />
        </Pressable>
      </View>
      <Text style={{ fontSize: Scale > 400 ? 24 : 20, fontWeight: "regular" }}>
        Horas formato de total HH:MM:SS
      </Text>
      <View style={styles.listContainer}>
        {MostrarSemanas ? (
          <>
            <FlatList
              data={Semanas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Checkbox
                    value={semanasSeleccionadas.includes(item.id)}
                    onValueChange={() => handleCheckboxChange(item.id)}
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "white",
                      borderRadius: 10,
                    }}
                  />
                  <Pressable
                    onPress={() => {
                      navigation.navigate("TablaHoras", {
                        idSem: item.id,
                      });
                    }}
                  >
                    <Text style={styles.txt}>
                      {"    "}
                      {item.Inicio} - {item.Fin}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", width: "auto" }}>
                Total acumulado: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  width: "auto",
                  marginTop: 10,
                }}
              >
                Total de horas seleccionadas: ( {calcularTotalSeleccionado()} )
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
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "70%",
    borderRadius: 20,
    marginTop: "8%",
    padding: "4%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
