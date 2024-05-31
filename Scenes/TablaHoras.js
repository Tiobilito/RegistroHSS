import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../Modulos/supabase";

export default function PaginaTablaHoras() {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  async function obtenerHoras() {
    const { data, error } = await supabase.from("horas").select("*");
    if (error) {
      console.log("error");
    }
    DefHoras(data);
    DefMostrarHoras(data.length > 0);
  }

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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>ID: {item.id}</Text>
              <Text>Inicio: {item.inicio}</Text>
              <Text>Final: {item.fin}</Text>
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
