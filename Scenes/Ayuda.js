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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChecCadPalabrasClave } from "../Modulos/VerificacionCad";

// Función para procesar el mensaje y devolver una respuesta estática
const handleGenericAPIRequest = async (message) => {
  const Verif = ChecCadPalabrasClave(message);
  console.log("El mensaje enviado es: " + message);

  if (!message.trim()) return null; // Ignorar mensajes vacíos

  const staticResponses = {
    hola: "¡Hola! ¿Cómo puedo ayudarte?",
    adios: "Hasta luego, que tengas un buen día.",
    ayuda: "Puedo responder preguntas básicas. Intenta preguntar algo específico.",
    "como estas": "Soy un bot, pero estoy aquí para ayudarte.",
    default: "No entiendo tu mensaje, intenta preguntar algo más.",
  };

  const lowerMessage = message.toLowerCase();
  return staticResponses[lowerMessage] || staticResponses["default"];
};

export default function PaginaAyuda() {
  // Obtenemos las dimensiones de la pantalla
  const { width, height } = useWindowDimensions();
  // Definimos un factor de escala basado en un ancho base de 375
  const scaleFactor = width / 375;

  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  const image = require("../assets/fondo.webp");

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;

    // Agregamos el mensaje del usuario
    const userMessage = { text: chatMessage, sender: "user" };
    setChatHistory((prev) => [...prev, userMessage]);

    // Obtenemos la respuesta del bot
    const botResponse = await handleGenericAPIRequest(chatMessage);
    const botMessage = { text: botResponse, sender: "bot" };
    setChatHistory((prev) => [...prev, botMessage]);

    setChatMessage("");
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
        <ScrollView style={styles.scrollView}>
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
            },
          ]}
          onChangeText={setChatMessage}
          value={chatMessage}
          placeholder="Escribe tu mensaje"
          placeholderTextColor="#999"
        />
        <Pressable onPress={sendMessage}>
          <Ionicons
            name="paper-plane"
            size={35 * scaleFactor}
            color="black"
          />
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
    elevation: 15, // Sombra en Android
    shadowColor: "#333333", // Sombra en iOS
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
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
