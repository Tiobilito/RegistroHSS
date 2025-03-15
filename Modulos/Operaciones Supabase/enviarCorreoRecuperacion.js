import { supabase } from "./supabase";
import { Alert } from "react-native";
import nodemailer from 'nodemailer';
import { TCP } from 'react-native-tcp';

const generarToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
};

// Función para verificar si el correo existe en la base de datos
async function verificarCorreo(correo) {
  const { data, error } = await supabase
    .from("Usuarios") // Asegúrate de que el nombre de la tabla sea correcto
    .select("Correo")
    .eq("Correo", correo)
    .single(); // Solo toma el primer resultado

  if (error) {
    console.error("Error en la consulta de correo:", error);
    Alert.alert("Error al verificar el correo");
    return false;
  }

  return data !== null; // Devuelve true si el correo existe, false si no
}

export async function enviarCorreoRecuperacion(correo) {
  // Verificar si el correo existe antes de proceder
  const correoExiste = await verificarCorreo(correo);
  
  if (!correoExiste) {
    Alert.alert("El correo no está registrado.");
    return;
  }

  const token = generarToken();
  const expiracion = new Date();
  expiracion.setMinutes(expiracion.getMinutes() + 10); // Expira en 10 minutos

  const { data, error } = await supabase
    .from("Usuarios")
    .update({ TokenReset: token, ExpiracionToken: expiracion, EstadoToken: false })
    .eq("Correo", correo);

  if (error) {
    Alert.alert("Error", "No se pudo generar el token. Inténtalo de nuevo.");
    return;
  }
    // Enviar correo con SendGrid
    try {
        const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587, // O 465 para SSL
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: 'apikey',
            pass: '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', // Reemplaza con tu clave API
        },
        connection: {
            socket: TCP,
        },
        });

        const info = await transporter.sendMail({
        from: 'registrohss1@gmail.com', // Reemplaza con tu correo
        to: correo,
        subject: 'Recuperación de contraseña',
        text: `Tu código de verificación es: ${token}`,
        });

        console.log('Correo enviado:', info.messageId);
        Alert.alert("Correo enviado", "Se ha enviado un código de verificación a tu correo.");
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        Alert.alert("Error", "No se pudo enviar el correo. Por favor, verifica tu conexión y la dirección de correo.");
    }
}

export async function validarToken(correo, tokenIngresado) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("TokenReset, ExpiracionToken, EstadoToken")
    .eq("Correo", correo)
    .single();

  if (error || !data) {
    Alert.alert("Error", "Correo no encontrado.");
    return false;
  }

  const { TokenReset, ExpiracionToken, EstadoToken } = data;
  const ahora = new Date();

  if (EstadoToken) {
    Alert.alert("Error", "Este código ya ha sido usado.");
    return false;
  }

  if (TokenReset !== tokenIngresado) {
    Alert.alert("Error", "El código es incorrecto.");
    return false;
  }

  if (ahora > new Date(ExpiracionToken)) {
    Alert.alert("Error", "El código ha expirado.");
    return false;
  }

  await supabase
    .from("Usuarios")
    .update({ EstadoToken: true })
    .eq("Correo", correo);

  return true;
}

export async function cambiarContraseña(correo, nuevaContraseña) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({
      Contraseña: nuevaContraseña,
      TokenReset: null,
      ExpiracionToken: null,
      EstadoToken: false
    })
    .eq("Correo", correo);

  if (error) {
    Alert.alert("Error", "No se pudo cambiar la contraseña.");
    return;
  }

  Alert.alert("Éxito", "Tu contraseña ha sido cambiada.");
}
