import { db } from "./SQLiteIni";
import { añadirHorasSup } from "../Operaciones Supabase/HorasSupa";
import { ObtenerDatosUsuario } from "./Usuario";
import { ChecarSemana, BorrarHorarioUsuario } from "./Semanas";

export const RespaldarRegistroEnSupa = async (registro) => {
  const isBacked = await añadirHorasSup(
    registro.idUsuario,
    registro.Inicio,
    registro.Final,
    registro.Total,
    registro.DInicio
  );
  if (isBacked != 0) {
    try {
      db.runSync(
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

export const ImportarDeSupaBD = async () => {
  const Usuario = await ObtenerDatosUsuario();
  const HorasSupa = await obtenerHoras(Usuario.Codigo);
  let idSemana;
  for (let i = 0; i < HorasSupa.length; i++) {
    const hora = HorasSupa[i];
    idSemana = await ChecarSemana(new Date(hora.DateInicio));
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
  }

  // Borrar el horario local antes de importar el nuevo horario
  await BorrarHorarioUsuario();

  // Importar el horario del usuario desde Supabase
  await ObtenerHorarioDesdeSupa(Usuario.Codigo);
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
