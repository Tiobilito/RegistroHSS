import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import db from "../Modulos/db";

export default function PaginaTablaHoras() {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  const obtenerHoras = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Horas;`,
        [],
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

  return (
    <View style={styles.container}>
      {MostrarHoras ? (
        <FlatList
          data={Horas}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>ID: {item.ID}</Text>
              <Text>Inicio: {item.Inicio}</Text>
              <Text>Final: {item.Final}</Text>
              <Text>Total: {item.Total}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No hay registros</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});