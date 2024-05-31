import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../Modulos/supabase";
import db from "../Modulos/db";

export default function PaginaTablaHoras() {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  async function getHours(){
  const {data,error} = await supabase.from("horas").select("*")
  if(error){

    console.log("error")
  }
  console.log(data)
  DefHoras(data)
  DefMostrarHoras(data.length > 0);
  console.log("lo que le paso a horas es=",Horas)
  console.log(Horas[0].inicio)

  }

  

  useFocusEffect(
    React.useCallback(() => {
      //obtenerHoras();
      getHours()
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
