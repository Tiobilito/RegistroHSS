import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINIAPIKEY;//aqui va la api key 

const handleGenericAPIRequest = async (message) => {
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

export default handleGenericAPIRequest;