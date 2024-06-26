import * as SQLite from "expo-sqlite/legacy";
import { ObtenerDatosUsuario } from "./InfoUsuario";
import NetInfo from '@react-native-community/netinfo';
import { añadirHorasSup } from "./OperacionesBD";

const db = SQLite.openDatabase("Horario.db");

// Inicializa la base de datos
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE IF NOT EXISTS "Horas" (
          "id"  INTEGER NOT NULL UNIQUE,
          "Inicio"  TEXT,
          "Final" TEXT,
          "Total" TEXT,
          "idUsuario" INTENGER NOT NULL,
          "IsBackedInSupabase"	INTEGER DEFAULT 0,
          PRIMARY KEY("id" AUTOINCREMENT)
        );
      `,
      [],
      null,
      (_, error) => {
        console.log("Error al crear la tabla Horas:", error);
        return true;
      }
    );
  });
};

// Función para formatear la fecha y hora
const formatearFechaHora = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return fecha.toLocaleString("es-ES", opciones).replace(",", " a las");
};

// Función para calcular la diferencia en formato HH:MM:SS
const calcularDiferenciaHoras = (inicio, fin) => {
  const diffMs = fin - inicio;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  return `${diffHrs.toString().padStart(2, "0")}:${diffMins
    .toString()
    .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;
};

// Añade horas
export const añadirHoras = async () => {
  const usuario = await ObtenerDatosUsuario();
  const inicio = new Date(usuario.Inicio);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  const total = calcularDiferenciaHoras(inicio, fin);
  let isBacked;

  const state = await NetInfo.fetch();
  
  if (state.isConnected) {
    // El dispositivo tiene conexión a Internet
    isBacked = await añadirHorasSup(usuario.Codigo, inicio, fin, total);
  } else {
    // El dispositivo no tiene conexión a Internet
    isBacked = 0;
  }

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Horas (Inicio, Final, Total, idUsuario, IsBackedInSupabase) VALUES (?, ?, ?, ?, ?);`,
      [inicioFormateado, finFormateado, total, parseInt(usuario.Codigo, 10), isBacked],
      (_, result) => {
        console.log("Registro de horas añadido con id:", result.insertId);
      },
      (_, error) => {
        console.log("Error al añadir el registro de horas:", error);
        return true; // Indica que el error fue manejado
      }
    );
  });
};

export default db;