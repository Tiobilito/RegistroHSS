import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const handleGenericAPIRequest = async (message, apiUrl) => {
  console.log("El mensaje enviado es: " + message);

  if(!apiUrl) {
    return "¡Ups! Parece que no has configurado la URL. Por favor, configúrala para poder continuar.";
  }

  if (!message.trim()) return null;

  try {
    const response = await fetch(apiUrl + "/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "RegistroChat",
        prompt: message,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return "¡Ups! Parece que hay problemas de conexión. Inténtalo de nuevo más tarde.";
  }
};

export default function PaginaAyuda() {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const [url, setUrl] = useState(""); // URL que se usará en el fetch

  // Estados para el modal de configuración de URL
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUrl, setTempUrl] = useState(url);

  const sendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = { text: chatMessage, sender: "user" };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");

    try {
      setIsLoading(true);
      const botResponse = await handleGenericAPIRequest(chatMessage, url);
      const botMessage = { text: botResponse, sender: "bot" };
      setChatHistory((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/fondo.webp")}
        style={[styles.container, { width, height }]}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flexContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          {/* Botón para abrir el modal de configuración de URL */}
          <View style={styles.configButtonContainer}>
            <Pressable
              style={styles.configButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons
                name="settings"
                size={24 * scaleFactor}
                color="#FFF"
              />
              <Text style={styles.configButtonText}>Configurar URL</Text>
            </Pressable>
          </View>

          {/* Contenedor del chat */}
          <View
            style={[
              styles.chatContainer,
              {
                width: width * 0.9,
                marginTop: height * 0.10,
                flex: 1,
              },
            ]}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardDismissMode="interactive"
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {chatHistory.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageContainer,
                    msg.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatText,
                      { fontSize: 16 * scaleFactor },
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
              {isLoading && (
                <View
                  style={[styles.messageContainer, styles.botMessage]}
                >
                  <ActivityIndicator size="small" color="#666" />
                </View>
              )}
            </ScrollView>
          </View>

          {/* Contenedor del input */}
          <View
            style={[
              styles.inputContainer,
              {
                marginHorizontal: width * 0.05,
                marginBottom: Platform.OS === "ios" ? 25 : 15,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  height: 40 * scaleFactor,
                  fontSize: 16 * scaleFactor,
                  marginRight: 10,
                },
              ]}
              onChangeText={setChatMessage}
              value={chatMessage}
              placeholder="Escribe tu mensaje"
              placeholderTextColor="#999"
              editable={!isLoading}
            />
            <Pressable onPress={sendMessage} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator
                  size={35 * scaleFactor}
                  color="#666"
                />
              ) : (
                <Ionicons
                  name="paper-plane"
                  size={35 * scaleFactor}
                  color={chatMessage.trim() ? "#2196F3" : "#999"}
                />
              )}
            </Pressable>
          </View>

          {/* Modal para configurar la URL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Configurar URL</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ingresa la URL"
                  placeholderTextColor="#999"
                  value={tempUrl}
                  onChangeText={setTempUrl}
                />
                <View style={styles.modalButtonContainer}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setUrl(tempUrl);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      Guardar
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setTempUrl(url);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      Cancelar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
  },
  configButtonContainer: {
    position: "absolute",
    top: 10, // Ajusta este valor según sea necesario
    right: 20,
    zIndex: 10,
  },
  configButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  marginTop: "10%",
  },
  configButtonText: {
    color: "#FFF",
    marginLeft: 6,
    fontSize: 16,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  chatText: {
    color: "#000",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
