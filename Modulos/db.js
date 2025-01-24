import * as SQLite from "expo-sqlite";
import { ObtenerDatosUsuario, ActualizarInicio } from "./InfoUsuario";
import NetInfo from "@react-native-community/netinfo";
import { añadirHorasSup, obtenerHoras } from "./OperacionesBD";

const db = SQLite.openDatabaseSync("Horario.db");

// Inicializa la base de datos
export const initializeDatabase = async () => {
  await db.execAsync(
    `
      CREATE TABLE IF NOT EXISTS "Horas" (
        "id" INTEGER NOT NULL UNIQUE,
        "DInicio" TEXT,
        "Inicio" TEXT,
        "Final" TEXT,
        "Total" TEXT,
        "idUsuario" INTEGER NOT NULL,
        "idSemana" INTEGER,
        "IsBackedInSupabase" INTEGER DEFAULT 0,
        "idSupabase" INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
      );
      CREATE TABLE IF NOT EXISTS "Semanas" (
        "id" INTEGER NOT NULL UNIQUE,
        "Inicio" TEXT,
        "Fin" TEXT,
        "idUsuario" INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `
  );
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

export const BorrarHora = async (idHora, idSemana) => {
  const data = await ObtenerDatosUsuario();
   
  try {
    await db.runAsync(`DELETE FROM Horas WHERE id = ?`, [idHora]);
    console.log(`Registro con id ${idHora} eliminado exitosamente`);
    try {
      const HorasSemana = await db.getAllAsync(
        `SELECT * FROM Horas WHERE idSemana = ? AND idUsuario = ?`,
        [idSemana, parseInt(data.Codigo, 10)]
      );
      if (HorasSemana.length === 0) {
        try {
          await db.runAsync(`DELETE FROM Semanas WHERE id = ?`, [idSemana]);
          console.log(`Semana con id ${idSemana} eliminada exitosamente`);
        } catch (error) {
          console.error("Error al eliminar la semana: ", error);
        }
      }
    } catch (error) {
      console.error("Error al verificar la semana: ", error);
    }
  } catch (error) {
    console.error("Error al abrir la base de datos:", error);
  }
};

export const añadirHoras = async () => {
   
  // Formateo de fechas
  const usuario = await ObtenerDatosUsuario();
  const inicio = new Date(usuario.Inicio);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  // Cálculo de total de horas
  const total = calcularDiferenciaHoras(inicio, fin);
  // Obtención de datos de usuario y semana
  const dIni = await ObtenerIniSemana(inicio);
  const idSem = await ChecarSemana(dIni);
  console.log("id semana: ", idSem);
  console.log("Inicio semana: ", dIni);
  let isBacked;
  // Verificación de conexión y respaldo en Supabase si está disponible
  const state = await NetInfo.fetch();

  if (state.isConnected) {
    // El dispositivo tiene conexión a Internet
    isBacked = await añadirHorasSup(
      usuario.Codigo,
      inicioFormateado,
      finFormateado,
      total,
      inicio
    );
  } else {
    // El dispositivo no tiene conexión a Internet
    isBacked = 0;
  }

  try {
    db.runSync(
      "INSERT INTO Horas (DInicio, Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        inicio.toString(),
        inicioFormateado,
        finFormateado,
        total,
        parseInt(usuario.Codigo, 10),
        isBacked,
        idSem,
      ]
    );
    console.log("Registro de horas añadido exitosamente");
    await ActualizarInicio("null");
  } catch (error) {
    console.error("Error al añadir el registro de horas:", error);
  }
};

export const añadirHoraModal = async (inicioFormulario, finFormulario) => {
   
  // Formateo de fechas
  const inicio = new Date(inicioFormulario);
  const fin = new Date(finFormulario);
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  // Cálculo de total de horas
  const total = calcularDiferenciaHoras(inicio, fin);
  // Obtención de datos de usuario y semana
  const usuario = await ObtenerDatosUsuario();
  const dIni = await ObtenerIniSemana(inicio);
  const idSem = await ChecarSemana(dIni);
  console.log("id semana: ", idSem);
  console.log("Inicio semana: ", dIni);
  // Verificación de conexión y respaldo en Supabase si está disponible
  const state = await NetInfo.fetch();
  let isBacked = 0;
  if (state.isConnected) {
    isBacked = await añadirHorasSup(
      usuario.Codigo,
      inicioFormateado,
      finFormateado,
      total,
      inicio
    );
  }
  try {
    db.runSync(
      "INSERT INTO Horas (DInicio, Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        inicioFormulario,
        inicioFormateado,
        finFormateado,
        total,
        parseInt(usuario.Codigo, 10),
        isBacked,
        idSem,
      ]
    );
    console.log("Registro de horas añadido exitosamente", );
  } catch (error) {
    console.error("Error al añadir el registro de horas:", error);
  }
};

const RespaldarRegistroEnSupa = async (registro) => {
   
  const isBacked = await añadirHorasSup(
    registro.idUsuario,
    registro.Inicio,
    registro.Final,
    registro.Total,
    registro.DInicio
  );
  if (isBacked != 0) {
    try {
      await db.runAsync(
        `UPDATE Horas SET IsBackedInSupabase = 1 WHERE id = ?`,
        [registro.id]
      );
      console.log("El registro se actualizo");
    } catch (error) {
      console.log("Error: ", error);
    }
  } else {
    console.log("No se pudo respaldar correctamente");
  }
};

export const ExportarASupaBD = async () => {
   
  try {
    const HorasARespaldar = await db.getAllAsync(
      "SELECT * FROM Horas WHERE IsBackedInSupabase = 0"
    );
    for (const registro of HorasARespaldar) {
      await RespaldarRegistroEnSupa(registro);
    }
  } catch (error) {
    console.log("Error al obtener horas: ", error);
  }
};

export const BorrarTSemHoras = async () => {
   
  try {
    await db.runAsync("DELETE FROM Horas");
    await db.runAsync("DELETE FROM Semanas");
    console.log("Registros de horas y semanas eliminados exitosamente");
  } catch (error) {
    console.error("Error al borrar los registros:", error);
  }
};

export const ImportarDeSupaBD = async () => {
   
  const Usuario = await ObtenerDatosUsuario();
  const HorasSupa = await obtenerHoras(Usuario.Codigo);
  let idSemana;
  for (let i = 0; i < HorasSupa.length; i++) {
    const hora = HorasSupa[i];
    idSemana = await ChecarSemana(new Date(hora.DateInicio));
    try {
      db.runSync(
        `INSERT INTO Horas (DInicio, Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          hora.DateInicio,
          hora.Inicio,
          hora.Final,
          hora.Total,
          hora.CodigoUsuario,
          parseInt(hora.IsBackedInSupabase, 10),
          idSemana,
        ]
      );
      console.log("Registro de horas añadido exitosamente");
    } catch (error) {
      console.error("Error al añadir el registro de horas:", error);
    }
  }
};

export const ObtenerIniSemana = async (FRef) => {
  const dateRef = new Date(FRef);
  const primerDia = dateRef.getDate() - dateRef.getDay() + 1; // Lunes
  const inicioSemana = new Date(dateRef.setDate(primerDia));
  inicioSemana.setHours(0, 0, 0, 0);
  return inicioSemana;
};

export const ObtenerFinSemana = async (FRef) => {
  const dateRef = new Date(FRef);
  const ultimoDia = dateRef.getDate() - dateRef.getDay() + 7; // Domingo
  const finSemana = new Date(dateRef.setDate(ultimoDia));
  finSemana.setHours(23, 59, 59, 999);
  return finSemana;
};

export const InsertarSemana = async (InicioS, FinalS) => {
   
  const usuario = await ObtenerDatosUsuario();
  const Inicio = InicioS.toLocaleDateString().toString();
  const Final = FinalS.toLocaleDateString().toString();
  try {
    const Semana = await db.runAsync(
      "INSERT INTO Semanas (Inicio, Fin, idUsuario) VALUES (?, ?, ?);",
      [Inicio, Final, parseInt(usuario.Codigo, 10)]
    );
    console.log("Semana añadida exitosamente");
    return Semana.lastInsertRowId;
  } catch (error) {
    console.error("Error al añadir la semana:", error);
  }
};

export const ChecarSemana = async (FRef) => {
   
  const data = await ObtenerDatosUsuario();
  const InicioS = await ObtenerIniSemana(FRef);
  const FinalS = await ObtenerFinSemana(FRef);

  try {
    const Semana = await db.getFirstAsync(
      "SELECT * FROM Semanas WHERE Inicio = ? AND Fin = ? AND idUsuario = ?",
      [
        InicioS.toLocaleDateString(),
        FinalS.toLocaleDateString(),
        parseInt(data.Codigo, 10),
      ]
    );
    if (Semana) {
      return Semana.id;
    } else {
      console.log("No se encontro la semana");
      const id = await InsertarSemana(InicioS, FinalS);
      return id;
    }
  } catch (error) {
    console.error("Error al obtener la semana:", error);
  }
};

export const sumarTiempos = (tiempoStrings) => {
  let totalSegundos = 0;

  tiempoStrings.forEach((tiempo) => {
    // Validar que el tiempo tenga el formato correcto y evitar errores de NaN
    if (typeof tiempo === "string" && tiempo.includes(":")) {
      const [horas, minutos, segundos] = tiempo.split(":").map(Number);

      // Validar que horas, minutos y segundos sean números válidos
      if (!isNaN(horas) && !isNaN(minutos) && !isNaN(segundos)) {
        totalSegundos += horas * 3600 + minutos * 60 + segundos;
      }
    }
  });

  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return `${horas}:${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;
};

export const obtenerHorasSemana = async (idSemana) => {
   
  const User = await ObtenerDatosUsuario();
  try {
    const Horas = await db.getAllAsync(
      `SELECT * FROM Horas WHERE idUsuario = ? AND idSemana = ?;`,
      [User.Codigo, idSemana]
    );
    return Horas;
  } catch (error) {
    console.error("Error al obtener las horas:", error);
  }
}

export const obtenerHorasUsuario = async () => {
  const Usuario = await ObtenerDatosUsuario();
   
  try {
    const Horas = await db.getAllAsync(
      `SELECT * FROM Horas WHERE idUsuario = ?;`,
      [Usuario.Codigo]
    );
    return Horas;
  } catch (error) {
    console.error("Error al obtener las horas:", error);
  }
}

export const obtenerSemanasUsuario = async () => {
  const Usuario = await ObtenerDatosUsuario();
   
  try {
    const Semanas = await db.getAllAsync(
      `SELECT * FROM Semanas WHERE idUsuario = ?;`,
      [Usuario.Codigo]
    );
    return Semanas;
  } catch (error) {
    console.error("Error al obtener las semanas:", error);
  }
}
