import React from 'react';
import { Modal, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const ModalUsuariosActivos = ({ visible, users, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Usuarios Activos</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.Codigo}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userCode}>{item.Codigo}</Text>
                <Text style={styles.userName}>{item.Nombre}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userCode: {
    fontWeight: 'bold',
  },
  userName: {
    color: '#666',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#2272A7',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ModalUsuariosActivos;