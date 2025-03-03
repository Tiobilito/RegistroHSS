import { db } from "./SQLiteIni";
import { ObtenerDatosUsuario, ActualizarInicio } from "../InfoUsuario";
import { formatearFechaHora, calcularDiferenciaHoras } from "./Utilidades";
import { ChecarSemana, ObtenerIniSemana } from "./Semanas";
import NetInfo from "@react-native-community/netinfo";
import { añadirHorasSup } from "../Operaciones Supabase/HorasSupa";

export const BorrarHora = async (idHora, idSemana) => {
  const data = await ObtenerDatosUsuario();
  try {
    db.runSync(`DELETE FROM Horas WHERE id = ?`, [idHora]);
    console.log(`Registro con id ${idHora} eliminado exitosamente`);
    try {
      const HorasSemana = await db.getAllAsync(
        `SELECT * FROM Horas WHERE idSemana = ? AND idUsuario = ?`,
        [idSemana, parseInt(data.Codigo, 10)]
      );
      if (HorasSemana.length === 0) {
        try {
          db.runSync(`DELETE FROM Semanas WHERE id = ?`, [idSemana]);
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
    console.log("Registro de horas añadido exitosamente");
  } catch (error) {
    console.error("Error al añadir el registro de horas:", error);
  }
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
};

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

// Función para obtener las horas acumuladas desde la base de datos
export const obtenerHorasAcumuladas = async () => {
  const horas = await obtenerHorasUsuario(); 
  if (horas && horas.length > 0) {
    const totalHorasSegundos = horas.reduce((acc, hora) => {
      // Verificar si la propiedad 'Total' es válida y no contiene valores inválidos
      if (hora.Total && hora.Total.includes(":")) {
        const [h, m, s] = hora.Total.split(":").map(Number); // Convertir "HH:MM:SS" a [h, m, s]
        if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
          return acc + (h * 3600 + m * 60 + s); // Convertir todo a segundos
        }
      }
      return acc; 
    }, 0);
    return totalHorasSegundos;
  } else {
    console.log("No se encontraron horas en la base de datos.");
  }
};
