import React from 'react';
import { View, Text, Modal, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyModal = ({ visible, onAccept }) => {
  
  const handleAccept = async () => {
    await AsyncStorage.setItem('privacyAccepted', 'true');
    onAccept();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => onAccept()}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Política de Privacidad</Text>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.content}>
              Bienvenido a nuestra aplicación. Nos tomamos muy en serio la privacidad de nuestros usuarios. 
              Esta política explica cómo usamos la información recopilada.
            </Text>

            <Text style={styles.sectionTitle}>1. Geolocalización</Text>
            <Text style={styles.content}>
              Nuestra aplicación accede a tu ubicación con el único propósito de mejorar la funcionalidad y experiencia del usuario. 
              La ubicación se utiliza en tiempo real y <Text style={styles.bold}>no se almacena en nuestros servidores.</Text>
            </Text>

            <Text style={styles.sectionTitle}>2. Uso de Biometría</Text>
            <Text style={styles.content}>
              Si activas la autenticación biométrica (huella dactilar o reconocimiento facial), esta solo se usará para verificar tu identidad 
              de forma local en tu dispositivo. <Text style={styles.bold}>No recopilamos ni almacenamos datos biométricos en servidores externos.</Text>
            </Text>

            <Text style={styles.sectionTitle}>3. Seguridad y Privacidad</Text>
            <Text style={styles.content}>
              Toda la información se maneja dentro de la aplicación. <Text style={styles.bold}>No compartimos ni almacenamos datos personales</Text> en servidores externos. 
              Solo utilizamos la información para mejorar la experiencia y funcionalidad de la app.
            </Text>

            <Text style={styles.sectionTitle}>4. Aceptación</Text>
            <Text style={styles.content}>
              Al continuar, confirmas que has leído y aceptado nuestra política de privacidad.
            </Text>
          </ScrollView>

          <Button title="Aceptar" onPress={handleAccept} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default PrivacyModal;