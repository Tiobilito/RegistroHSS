import { io } from "socket.io-client";
import { ObtenerDatosUrls } from "./InfoUsuario";

// URL del servidor WebSocket
let SERVER_URL;
let socket;

// Función para registrar un usuario activo
export function registerActiveUser(codigo, idDepartamento) {
  const userData = {
    Codigo: codigo,
    idDepartamento: idDepartamento,
  };

  socket.emit("add_active", userData, (response) => {
    console.log("Respuesta del servidor al registrar usuario:", response);
  });
}

// Función para solicitar usuarios activos de un departamento
export function requestActiveUsersByDepartment(idDepartamento) {
  const departmentData = {
    idDepartamento: idDepartamento,
  };

  socket.emit("emit_active_users_by_department", departmentData, (response) => {
    console.log("Usuarios activos en el departamento:", response);
  });
}

// Función para manejar eventos del servidor
function handleServerEvents() {
  socket.on("user_status_updated", (data) => {
    console.log("Estado de usuario actualizado:", data);
  });

  socket.on("active_users", (data) => {
    console.log("Usuarios activos recibidos:", data);
  });
}

// Función para manejar la conexión al servidor
function handleConnection() {
  socket.on("connect", () => {
    console.log("Conectado a la api con el ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor WebSocket");
  });
}

// Inicializar todas las funciones
export async function initializeWebSocketClient() {
  const Urls = await ObtenerDatosUrls();
  if (Urls) {
    SERVER_URL = Urls.Api;
    socket = io(SERVER_URL);
  }
  handleConnection();
  handleServerEvents();
}
