import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Ionicons from "@expo/vector-icons/Ionicons";

const handleGenericAPIRequest = async (message) => {
  const API_KEY = process.env.EXPO_PUBLIC_GEMINIAPIKEY;
  console.log("El mensaje enviado es: " + message);

  if (!message.trim()) return null; // No hacer nada si el mensaje está vacío

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

  return (
    <View style={styles.background}>
      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 10 }}>{ChatRequest}</Text>
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
              }
            }}
          >
            <Ionicons name="paper-plane" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 35,
    flex: 1,
    padding: 10,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "1%", // Espacio horizontal entre elementos
    marginTop: "1%",
  },
});
