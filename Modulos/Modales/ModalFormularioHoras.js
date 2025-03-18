import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

const ModalFormulario = ({
  modalVisible,
  closeModal,
  closeModalAndSent,
  formData,
  setFormData,
  refreshData,
}) => {

  const handleCloseModalAndSent = async () => {
    await refreshData();
    await closeModalAndSent();
  };
  
  const handleDateChange = (field, value) => {
    // Permitir que el valor sea vacío o parcial y no forzar la validación inmediata.
    if (value === "" || value === "0" || value === "00") {
      setFormData((prev) => ({ ...prev, [field]: value }));
      return;
    }
    const validatedValue = Math.max(0, parseInt(value) || 0);
    if (field === "day") {
      // Aplicar validación solo cuando el valor es completo (2 dígitos)
      if (value.length === 2) {
        setFormData((prev) => ({
          ...prev,
          day: String(Math.min(validatedValue, 31)).padStart(2, "0"),
        }));
      } else {
        setFormData((prev) => ({ ...prev, day: value })); // Permitir valor parcial
      }
    } else if (field === "month") {
      if (value.length === 2) {
        setFormData((prev) => ({
          ...prev,
          month: String(Math.min(validatedValue, 12)).padStart(2, "0"),
        }));
      } else {
        setFormData((prev) => ({ ...prev, month: value }));
      }
    } else if (field === "year") {
      if (value.length === 4) {
        setFormData((prev) => ({
          ...prev,
          year: String(Math.min(validatedValue, 9999)),
        }));
      } else {
        setFormData((prev) => ({ ...prev, year: value }));
      }
    }
  };

  const handleTimeChange = (field, value) => {
    // Permite el valor vacío y no aplica validación hasta que haya un número.
    if (value === "") {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    const validatedValue = Math.max(0, parseInt(value) || 0);
    if (field === "entryHours" || field === "exitHours") {
      setFormData((prev) => ({
        ...prev,
        [field]: String(Math.min(validatedValue, 23)),
      }));
    } else if (
      field === "entryMinutes" ||
      field === "entrySeconds" ||
      field === "exitMinutes" ||
      field === "exitSeconds"
    ) {
      setFormData((prev) => ({
        ...prev,
        [field]: String(Math.min(validatedValue, 59)),
      }));
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.timeInputSection}>
            <Text style={styles.modalSubtitle}>Fecha (DD/MM/YYYY)</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={formData.day}
                onChangeText={(value) => handleDateChange("day", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="DD"
              />
              <Text style={styles.separator}>/</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.month}
                onChangeText={(value) => handleDateChange("month", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
              />
              <Text style={styles.separator}>/</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.year}
                onChangeText={(value) => handleDateChange("year", value)}
                keyboardType="numeric"
                maxLength={4}
                placeholder="YYYY"
              />
            </View>
          </View>

          <View style={styles.timeInputSection}>
            <Text style={{fontSize:20, marginTop: -30}}>Formato de 24 horas</Text>
            <Text style={styles.modalSubtitle}>Hora de Entrada</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={formData.entryHours}
                onChangeText={(value) => handleTimeChange("entryHours", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="HH"
              />
              <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.entryMinutes}
                onChangeText={(value) =>
                  handleTimeChange("entryMinutes", value)
                }
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
              />
              <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.entrySeconds}
                onChangeText={(value) =>
                  handleTimeChange("entrySeconds", value)
                }
                keyboardType="numeric"
                maxLength={2}
                placeholder="SS"
              />
            </View>
          </View>

          <View style={styles.timeInputSection}>
            <Text style={styles.modalSubtitle}>Hora de Salida</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={formData.exitHours}
                onChangeText={(value) => handleTimeChange("exitHours", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="HH"
              />
              <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.exitMinutes}
                onChangeText={(value) => handleTimeChange("exitMinutes", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
              />
              <Text style={styles.separator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={formData.exitSeconds}
                onChangeText={(value) => handleTimeChange("exitSeconds", value)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="SS"
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Pressable onPress={closeModal} style={styles.button}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
            <View style={{ marginHorizontal: 10 }} />
            <Pressable onPress={handleCloseModalAndSent} style={styles.button}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timeInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: 50,
    textAlign: "center",
    fontSize: 18,
  },
  separator: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  timeInputSection: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ModalFormulario;
