import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChecCadPalabrasClave } from "../Modulos/VerificacionCad";

const handleGenericAPIRequest = async (message) => {
  const API_KEY = "AIzaSyBLWtQ3K4N13T3zewGDv7fZM37NYY0yh80";
  const Verif = ChecCadPalabrasClave(message);
  console.log("El mensaje enviado es: " + message);

  if (!message.trim()) return null; // No hacer nada si el mensaje está vacío
  else if (Verif == false) return "Mensaje no valido";

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = await response.text();
    console.log("La respuesta es: " + text);
    return text;
  } catch (error) {
    console.error("Error sending chat request:", error);
    return null;
  }
};

export default function PaginaAyuda() {
  const [ChatRequest, DefChatRequest] = useState("");
  const [ChatMessage, DefChatMessage] = useState("");

  const image = require("../assets/fondo.png");

  return (
    <ImageBackground source={image} style={styles.container}>
      <View style={styles.chatContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.chatText}>{ChatRequest}</Text>
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefChatMessage(text);
          }}
          value={ChatMessage}
          placeholder="Mensaje"
        />
        <TouchableOpacity
          onPress={() => {
            if (ChatMessage !== "") {
              DefChatRequest(handleGenericAPIRequest(ChatMessage));
              DefChatMessage("");
            }
          }}
        >
          <Ionicons name="paper-plane" size={35} color="black" />
        </TouchableOpacity>
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
    //marginTop: "4%",
    padding: "4%",
    //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatText: {
    fontSize: 20,
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
});
