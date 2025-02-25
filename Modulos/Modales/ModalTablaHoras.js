import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { obtenerHorasSemana, BorrarHora } from "../Base de Datos Sqlite/Horas";
import { sumarTiempos } from "../Base de Datos Sqlite/Utilidades";

export default function ModalTablaHoras({
  modalVisible,
  closeModal,
  idSem,
}) {
  const { width, height } = useWindowDimensions();
  const [horas, setHoras] = useState([]);

  // Cargar las horas cuando se muestre el modal o cambie el idSem
  useEffect(() => {
    if (modalVisible) {
      cargarHoras();
    }
  }, [modalVisible, idSem]);

  const cargarHoras = async () => {
    const horasSemana = await obtenerHorasSemana(idSem);
    setHoras(horasSemana);
  };

  const handleBorrar = (id, idSemana) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          onPress: () => {
            BorrarHora(id, idSemana);
            // Actualizar el listado tras borrar
            cargarHoras();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Ionicons
        name={item.IsBackedInSupabase === 0 ? "cloud-offline" : "cloud"}
        size={24}
        color="black"
      />
      <View style={styles.itemDetails}>
        <Text>Inicio: {item.Inicio}</Text>
        <Text>Final: {item.Final}</Text>
        <Text>Total: {item.Total}</Text>
      </View>
      <Pressable onPress={() => handleBorrar(item.id, item.idSemana)}>
        <Ionicons name="trash" size={24} color="red" />
      </Pressable>
    </View>
  );

  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: width * 0.9, maxHeight: height * 0.8 }]}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Horas Registradas</Text>
            <Pressable onPress={closeModal}>
              <Ionicons name="close-circle" size={30} color="black" />
            </Pressable>
          </View>
          {/* Listado de horas */}
          {horas && horas.length > 0 ? (
            <FlatList
              data={horas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : (
            <Text style={styles.noRecordsText}>No hay registros</Text>
          )}
          {/* Total acumulado */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total acumulado: {sumarTiempos(horas.map((item) => item.Total))}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  noRecordsText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
