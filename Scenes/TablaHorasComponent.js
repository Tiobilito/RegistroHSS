import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BorrarHora, sumarTiempos, obtenerHorasSemana } from "../Modulos/Base de Datos Sqlite/db";

export default function PaginaTablaHorasComponent({ idSem }) {
  const { width, height } = useWindowDimensions();
  // Factor de escala basado en un ancho base de 375
  const scaleFactor = width / 375;

  const [Horas, setHoras] = useState([]);
  const [MostrarHoras, setMostrarHoras] = useState(false);

  const obtenerHoras = async () => {
    const HorasSemana = await obtenerHorasSemana(idSem);
    setHoras(HorasSemana);
    // Se muestra si hay registros; usamos longitud del array para determinarlo
    setMostrarHoras(HorasSemana.length > 0);
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerHoras();
    }, [])
  );

  return (
    <View
      style={[
        styles.listContainer,
        {
          // Ajustamos el ancho, padding y margen superior en función de la pantalla
          width: width * 0.9,
          padding: width * 0.04,
          marginTop: height * 0.02,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 25 * scaleFactor,
          fontWeight: "bold",
          color: "black",
          marginBottom: height * 0.015,
        }}
      >
        Horas
      </Text>
      {MostrarHoras ? (
        <>
          <FlatList
            contentContainerStyle={{ paddingBottom: height * 0.02 }}
            data={Horas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.item,
                  {
                    padding: width * 0.03,
                    marginTop: height * 0.02,
                  },
                ]}
              >
                {item.IsBackedInSupabase === 0 ? (
                  <Ionicons
                    name="cloud-offline"
                    size={30 * scaleFactor}
                    color="white"
                  />
                ) : (
                  <Ionicons
                    name="cloud"
                    size={30 * scaleFactor}
                    color="white"
                  />
                )}
                <Text style={[styles.txt, { fontSize: 12 * scaleFactor }]}>
                  Inicio: {item.Inicio}
                </Text>
                <Text style={[styles.txt, { fontSize: 12 * scaleFactor }]}>
                  Final: {item.Final}
                </Text>
                <Text style={[styles.txt, { fontSize: 12 * scaleFactor }]}>
                  Total: {item.Total}
                </Text>
                <Pressable
                  style={{ padding: 10 }}
                  onPress={() => {
                    Alert.alert(
                      "Confirmación",
                      "¿Estás seguro de que quieres eliminar este registro?",
                      [
                        {
                          text: "Cancelar",
                          onPress: () => console.log("Borrado Cancelado"),
                          style: "cancel",
                        },
                        {
                          text: "Borrar",
                          onPress: () => {
                            BorrarHora(item.id, item.idSemana);
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  {/* Ajustamos el margen para posicionar el ícono de la papelera */}
                  <View
                    style={{
                      marginLeft: width * 0.5,
                      marginTop: -height * 0.05,
                    }}
                  >
                    <Ionicons
                      name="trash"
                      size={30 * scaleFactor}
                      color="white"
                    />
                  </View>
                </Pressable>
              </View>
            )}
          />
          <View style={{ marginTop: height * 0.02 }}>
            <Text
              style={{
                fontSize: 15 * scaleFactor,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Total acumulado en la semana: (
              {sumarTiempos(Horas.map((item) => item.Total))})
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ fontSize: 18 * scaleFactor, color: "black" }}>
          No hay registros
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    color: "white",
  },
  item: {
    backgroundColor: "#2272A7",
    borderRadius: 20,
    // Sombras para Android e iOS
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  listContainer: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    borderRadius: 10,
    // Elevación y sombras para darle efecto de "card"
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
