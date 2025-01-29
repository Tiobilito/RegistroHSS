import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChecCadPalabrasClave } from "../Modulos/VerificacionCad";

const handleGenericAPIRequest = async (message) => {
  const Verif = ChecCadPalabrasClave(message);
  console.log("El mensaje enviado es: " + message);

  if (!message.trim()) return null; // Ignorar mensajes vacíos
 // else if (!Verif) return "Mensaje no válido";

 
  const staticResponses = {
    "hola": "¡Hola! ¿Cómo puedo ayudarte?",
    "adios": "Hasta luego, que tengas un buen día.",
    "ayuda": "Puedo responder preguntas básicas. Intenta preguntar algo específico.",
    "como estas": "Soy un bot, pero estoy aquí para ayudarte.",
    "default": "No entiendo tu mensaje, intenta preguntar algo más.",
  };


  const lowerMessage = message.toLowerCase();
  return staticResponses[lowerMessage] || staticResponses["default"];
};

export default function PaginaAyuda() {
  const [chatHistory, setChatHistory] = useState([]); 
  const [chatMessage, setChatMessage] = useState("");

  const image = require("../assets/fondo.webp");

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = { text: chatMessage, sender: "user" };
    setChatHistory((prev) => [...prev, userMessage]);

    // Obtener respuesta del bot
    const botResponse = await handleGenericAPIRequest(chatMessage);
    const botMessage = { text: botResponse, sender: "bot" };
    setChatHistory((prev) => [...prev, botMessage]);

    setChatMessage("");
  };

  return (
    <ImageBackground source={image} style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView style={styles.scrollView}>
          {chatHistory.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.chatText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setChatMessage}
          value={chatMessage}
          placeholder="Escribe tu mensaje"
        />
        <Pressable onPress={sendMessage}>
          <Ionicons name="paper-plane" size={35} color="black" />
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
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "70%",
    borderRadius: 20,
    padding: "4%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatText: {
    fontSize: 16,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 25,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: "white",
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
});
