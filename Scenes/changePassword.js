import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView, // Importar KeyboardAvoidingView
  Platform, // Para manejar el comportamiento específico según el sistema operativo
} from "react-native";
import { changePassword } from "../Modulos/Operaciones Supabase/UsuariosSupa";

const image = require("../assets/Back.png");
const API_BASE_URL = "https://checkactives-api-registrohss.onrender.com";

export default function ChangePassword({ navigation }) {
  const { width } = useWindowDimensions();
  
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estado para controlar el modal de carga
  const [isLoading, setIsLoading] = useState(false);

  async function handleRequestToken() {
    if (isLoading) return; // Aseguramos que no se ejecute si ya está en carga
  
    if (!email) {
      Alert.alert("Error", "Por favor ingresa un correo válido.");
      return;
    }
  
    setIsLoading(true);  // Mostrar el modal de carga
  
    try {
      const response = await fetch(`${API_BASE_URL}/send-reset-token/${email}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Token enviado", "Revisa tu correo para el token.");
      } else {
        Alert.alert("Error", data.detail || "Error al solicitar el token");
      }
    } catch (error) {
      console.error("Error solicitando el token:", error);
      Alert.alert("Error", "Error al solicitar el token");
    } finally {
      setIsLoading(false);  // Ocultar el modal de carga
    }
  }

  async function handleVerifyToken() {
    if (isLoading) return; // Aseguramos que no se ejecute si ya está en carga
  
    if (!token) {
      Alert.alert("Error", "Por favor ingresa un token válido.");
      return;
    }
  
    setIsLoading(true);  // Mostrar el modal de carga
  
    try {
      const response = await fetch(`${API_BASE_URL}/verify-token/${token}`);
      const data = await response.json();
      if (data.user_id) {
        setUserId(data.user_id);
        Alert.alert("Token verificado", "Token validado exitosamente");
      } else {
        Alert.alert("Token inválido", "El token es inválido o ha expirado");
        setUserId("");
      }
    } catch (error) {
      console.error("Error verificando el token:", error);
      Alert.alert("Error", "Error al verificar el token");
      setUserId("");
    } finally {
      setIsLoading(false);  // Ocultar el modal de carga
    }
  }  

  async function handleChangePassword() {
    if (isLoading) return; // Aseguramos que no se ejecute si ya está en carga
  
    if (!userId) {
      Alert.alert("Error", "Primero verifica el token");
      return;
    }
    if (password !== newPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
  
    setIsLoading(true);  // Mostrar el modal de carga
  
    try {
      await changePassword(password, userId);
      await fetch(`${API_BASE_URL}/remove-token/${token}`, { method: "POST" });
      Alert.alert("Éxito", "Contraseña cambiada exitosamente");
      navigation.navigate("Ingreso");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      Alert.alert("Error", "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);  // Ocultar el modal de carga
    }
  }

  const scaleFont = (size) => (width / 375) * size;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajustar comportamiento según plataforma
      >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={image} style={styles.imgBackground}>
        <Text style={styles.title}>Recuperar contraseña</Text>
          <View style={styles.formContainer}>
            {!userId && (
              <>
                {/* Sección para solicitar token */}
                <View style={styles.section}>
                  <Text style={[styles.title, { fontSize: scaleFont(24) }]}>
                    Solicitar Token
                  </Text>
                  <View style={styles.subtitleContainer}>
                    <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                      Ingresa tu correo
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      placeholder="Correo electrónico"
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <Pressable
                    style={[styles.btnIngresar, { width: "60%" }]}
                    onPress={handleRequestToken}
                    disabled={isLoading}  // Deshabilitar mientras se carga
                  >
                    <Text style={styles.txtBtn}>Solicitar token</Text>
                  </Pressable>
                </View>

                {/* Sección para verificar token */}
                <View style={styles.section}>
                  <Text style={[styles.title, { fontSize: scaleFont(24) }]}>
                    Verificar Token
                  </Text>
                  <View style={styles.subtitleContainer}>
                    <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                      Ingresa el token
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={token}
                      placeholder="Token"
                      onChangeText={setToken}
                      autoCapitalize="none"
                    />
                  </View>
                  <Pressable
                    style={[styles.btnIngresar, { width: "60%", marginBottom: 20 }]}
                    onPress={handleVerifyToken}
                    disabled={isLoading}  // Deshabilitar mientras se carga
                  >
                    <Text style={styles.txtBtn}>Verificar token</Text>
                  </Pressable>
                </View>
              </>
            )}
            {userId && (
              <View style={styles.section}>
                <Text style={[styles.title, { fontSize: scaleFont(24) }]}>
                  Cambiar Contraseña
                </Text>
                <View style={styles.subtitleContainer}>
                  <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                    Ingresa la nueva contraseña
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Text style={[styles.subtitle, { fontSize: scaleFont(18) }]}>
                    Confirma la nueva contraseña
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>
                <Pressable
                  style={[styles.btnIngresar, { width: "60%" }]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.txtBtn}>Cambiar contraseña</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de carga */}
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Cargando...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitleContainer: {
    alignSelf: "stretch",
    paddingHorizontal: "5%",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 5,
    color: "black",
  },
  input: {
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#C5E0F2",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 15,
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 10,
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 120,
    width: 120,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
});
