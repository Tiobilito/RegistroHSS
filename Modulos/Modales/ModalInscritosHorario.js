import React from "react";
import { View, Text, Modal, StyleSheet, ScrollView, Button } from "react-native";

const ModalInscritos = ({ visible, day, hour, persons, onClose }) => {
  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hr = hour % 12 === 0 ? 12 : hour % 12;
    return `${hr}:00 ${period}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Inscritos para {day} - {formatHour(hour)}
          </Text>
          <ScrollView style={styles.modalScroll}>
            {persons.map((person, index) => (
              <Text key={index} style={styles.modalText}>
                {person.name}
              </Text>
            ))}
          </ScrollView>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalScroll: {
    maxHeight: 200,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ModalInscritos;
