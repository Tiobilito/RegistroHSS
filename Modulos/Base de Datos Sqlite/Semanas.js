import { db } from "./SQLiteIni";
import { ObtenerDatosUsuario } from "../InfoUsuario";

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

export const BorrarTSemHoras = async () => {
  try {
    db.runSync("DELETE FROM Horas");
    db.runSync("DELETE FROM Semanas");
    console.log("Registros de horas y semanas eliminados exitosamente");
  } catch (error) {
    console.error("Error al borrar los registros:", error);
  }
};

export const InsertarSemana = async (InicioS, FinalS) => {
  const usuario = await ObtenerDatosUsuario();
  const Inicio = InicioS.toLocaleDateString().toString();
  const Final = FinalS.toLocaleDateString().toString();
  try {
    const Semana = db.runSync(
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
