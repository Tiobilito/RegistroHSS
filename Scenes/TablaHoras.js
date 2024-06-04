import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../Modulos/supabase";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";  // Asegúrate de que la ruta es correcta

export default function PaginaTablaHoras() {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  async function obtenerHoras() {
    try {
      const usuario = await ObtenerDatosUsuario();
      console.log(usuario)
      if (usuario && usuario.Codigo) {
        const codigoUsuario = parseInt(usuario.Codigo, 10);
        const { data, error } = await supabase
          .from("Horas")
          .select("*")
          .eq("CodigoUsuario", codigoUsuario);
        if (error) {
          console.log("Error al obtener horas:", error);
        } else {
          DefHoras(data);
          DefMostrarHoras(data.length > 0);
        }
      } else {
        console.log("No se encontraron datos del usuario.");
      }
    } catch (error) {
      console.log("Error al obtener datos del usuario:", error);
    }
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
