import { db } from "./SQLiteIni";
import {
  añadirHorasSup,
  obtenerHoras,
} from "../Operaciones Supabase/HorasSupa";
import { ObtenerDatosUsuario, BorrarHorarioUsuario } from "../InfoUsuario";
import { ObtenerHorarioDesdeSupa } from "../Operaciones Supabase/HorarioSupa";
import { ChecarSemana } from "./Semanas";

export const RespaldarRegistroEnSupa = async (registro) => {
  const idSupabase = await añadirHorasSup(
    registro.idUsuario,
    registro.Inicio,
    registro.Final,
    registro.Total,
    registro.DInicio
  );
  if (idSupabase != null) {
    try {
      db.runSync(
        `UPDATE Horas SET IsBackedInSupabase = 1, idSupabase = ? WHERE id = ?`,
        [idSupabase, registro.id]
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
      `INSERT INTO Horas (DInicio, Inicio, Final, Total, idUsuario, idSupabase, idSemana, IsBackedInSupabase) VALUES (?, ?, ?, ?, ?, ?, ?, 1);`,
      [
        hora.DateInicio,
        hora.Inicio,
        hora.Final,
        hora.Total,
        hora.CodigoUsuario,
        parseInt(hora.id, 10),
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
