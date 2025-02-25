import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ollama from "ollama";

const handleGenericAPIRequest = async (message) => {
  console.log("El mensaje enviado es: " + message);

  if (!message.trim()) return null;

  try {
    const response = await fetch("http://10.0.2.2:11434api/generate", {
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

  const image = require("../assets/fondo.webp");

  const sendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    // Mensaje del usuario
    const userMessage = { text: chatMessage, sender: "user" };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");

    try {
      setIsLoading(true);
      const botResponse = await handleGenericAPIRequest(chatMessage);
      const botMessage = { text: botResponse, sender: "bot" };
      setChatHistory((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      {/* Contenedor del chat */}
      <View
        style={[
          styles.chatContainer,
          {
            width: width * 0.9,
            height: height * 0.7,
            padding: width * 0.04,
            marginTop: height * 0.05,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {chatHistory.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={[styles.chatText, { fontSize: 16 * scaleFactor }]}>
                {msg.text}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageContainer, styles.botMessage]}>
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
            padding: 10,
            marginHorizontal: width * 0.05,
            bottom: height * 0.02,
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
            <ActivityIndicator size={35 * scaleFactor} color="#666" />
          ) : (
            <Ionicons
              name="paper-plane"
              size={35 * scaleFactor}
              color={chatMessage.trim() ? "#2196F3" : "#999"}
            />
          )}
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    position: "absolute",
    width: "90%",
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
});
