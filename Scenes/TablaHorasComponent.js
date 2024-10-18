import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import db, { BorrarHora, sumarTiempos } from "../Modulos/db";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

export default function PaginaTablaHorasComponent({ idSem }) {
  const [Horas, DefHoras] = useState([]);
  const [MostrarHoras, DefMostrarHoras] = useState(false);

  const handleDelete = (id, idSemana) => {
    console.log("Se intenta eliminar el registro: ", id);
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres eliminar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          onPress: () => handleBorrarHora(id, idSemana),
        },
      ],
      { cancelable: false }
    );
  };

  const obtenerHoras = async () => {
    const User = await ObtenerDatosUsuario();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Horas WHERE idUsuario = ? AND idSemana = ?;`,
        [User.Codigo, idSem],
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
    <>
      <View style={styles.listContainer}>
        <Text style={{ fontSize: 25, fontWeight: "bold", width: "auto" }}>
          Horas:
        </Text>
        {MostrarHoras ? (
          <>
            <FlatList
              contentContainerStyle={{ paddingBottom: 20 }}
              data={Horas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.IsBackedInSupabase == 0 ? (
                    <Ionicons name="cloud-offline" size={30} color="white" />
                  ) : (
                    <Ionicons name="cloud" size={15} color="white" />
                  )}
                  <Text style={styles.txt}>Inicio: {item.Inicio}</Text>
                  <Text style={styles.txt}>Final: {item.Final}</Text>
                  <Text style={styles.txt}>Total: {item.Total}</Text>
                  <Pressable
                    style={{ padding: 10 }}
                    onPress={() => handleDelete(item.id, item.idSemana)}
                  >
                    <View style={{ marginLeft: 200, marginTop: -50 }}>
                      <Ionicons name="trash" size={30} color="white" />
                    </View>
                  </Pressable>
                </View>
              )}
              initialNumToRender={2}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={50} // Controla cómo se actualizan las celdas
              removeClippedSubviews={true} // Ayuda con el rendimiento cuando hay muchos ítems
              getItemLayout={(data, index) => (
                { length: 70, offset: 70 * index, index }
              )}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: "bold", width: "auto" }}>
                Total acumulado en la semana: ({" "}
                {sumarTiempos(Horas.map((item) => item.Total))} )
              </Text>
            </View>
          </>
        ) : (
          <Text>No hay registros</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  txtMain: {
    color: "white",
    fontWeight: "bold",
  },
  txt: {
    color: "white",
    fontSize: 12,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  item: {
    backgroundColor: "#2272A7",
    borderRadius: 20,
    marginTop: "2%",
    // //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    padding: 10,
  },
  listContainer: {
    backgroundColor: "#f0f0f0",
    width: "90%",
    flex: 1, // Cambiar height a flex
    borderRadius: 10,
    marginTop: "2%",
    width: "100%",
    padding: "4%",
    elevation: 15,
  },
});
