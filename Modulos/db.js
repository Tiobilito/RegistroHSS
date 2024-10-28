import * as SQLite from "expo-sqlite/legacy";
import { ObtenerDatosUsuario, ActualizarInicio } from "./InfoUsuario";
import NetInfo from "@react-native-community/netinfo";
import { añadirHorasSup, obtenerHoras } from "./OperacionesBD";

const db = SQLite.openDatabase("Horario.db");

// Inicializa la base de datos
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
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
      `,
      [],
      null,
      (_, error) => {
        console.log("Error al crear la tabla Horas:", error);
        return true;
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE IF NOT EXISTS "Semanas" (
          "id" INTEGER NOT NULL UNIQUE,
          "Inicio" TEXT,
          "Fin" TEXT,
          "idUsuario" INTEGER NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT)
        );
      `,
      [],
      null,
      (_, error) => {
        console.log("Error al crear la tabla Semanas:", error);
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

//Borra un registro en la tabla horas, ademas de verificar que la semana tenga al menos 1 registro asociado, sino la borra
export const BorrarHora = async (idHora, idSemana) => {
  const data = await ObtenerDatosUsuario();

  // Primero, eliminamos el registro de horas
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM Horas WHERE id = ?`,
      [idHora],
      () => {
        console.log(`Registro con id ${idHora} eliminado exitosamente`);

        // Luego, verificamos si la semana tiene otros registros asociados
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM Horas WHERE idSemana = ? AND idUsuario = ?`,
            [idSemana, parseInt(data.Codigo, 10)],
            (_, { rows }) => {
              if (rows.length > 0) {
                // Si hay al menos 1 registro asociado a la semana del registro eliminado
                console.log("Semana con al menos 1 registro asociado");
              } else {
                // Si la semana ya no tiene registros asociados, la eliminamos
                db.transaction((tx) => {
                  tx.executeSql(
                    `DELETE FROM Semanas WHERE id = ?`,
                    [idSemana],
                    () => {
                      console.log(
                        `Semana con id ${idSemana} eliminada exitosamente`
                      );
                    },
                    (_, error) => {
                      console.error("Error al eliminar la semana: ", error);
                    }
                  );
                });
              }
            },
            (_, error) => {
              console.error("Error al verificar la semana: ", error);
            }
          );
        });
      },
      (_, error) => {
        console.log(`Error al eliminar el registro con id ${idHora}:`, error);
        return true; // Indica que el error fue manejado
      }
    );
  });
};

// Añade horas
export const añadirHoras = async () => {
  const usuario = await ObtenerDatosUsuario();
  const inicio = new Date(usuario.Inicio);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  const total = calcularDiferenciaHoras(inicio, fin);
  const dIni = await ObtenerIniSemana(inicio);
  const idSem = await ChecarSemana(dIni);
  console.log("id semana: ", idSem);
  console.log("Inicio semana: ", dIni);
  let isBacked;

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
  db.transaction(async (tx) => {
    tx.executeSql(
      `INSERT INTO Horas (Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        inicioFormateado,
        finFormateado,
        total,
        parseInt(usuario.Codigo, 10),
        isBacked,
        idSem,
      ],
      async (_, result) => {
        console.log("Registro de horas añadido con id:", result.insertId);
        await ActualizarInicio("null");
      },
      (_, error) => {
        console.log("Error al añadir el registro de horas:", error);
        return true; // Indica que el error fue manejado
      }
    );
  });
};

// Función para añadir horas desde los datos del formulario en el modal
export const añadirHoraModal = async (inicioFormulario, finFormulario) => {
  try {
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
    // Inserción en la base de datos local
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Horas (Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          inicioFormateado,
          finFormateado,
          total,
          parseInt(usuario.Codigo, 10),
          isBacked,
          idSem,
        ],
        (_, result) => {
          console.log("Registro de horas añadido con id:", result.insertId);
          // Restablece el valor de inicio en usuario
          ActualizarInicio("null");
        },
        (_, error) => {
          console.error("Error al añadir el registro de horas:", error);
          return true;
        }
      );
    });
  } catch (error) {
    console.error("Error en la función añadirHora:", error);
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
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Horas SET IsBackedInSupabase = 1 WHERE id = ?`,
        [registro.id],
        (_, result) => {
          console.log("El registro se actualizo");
        },
        (_, error) => {
          console.log("Error: ", error);
          return true; // Indica que el error fue manejado
        }
      );
    });
  } else {
    console.log("No se pudo respaldar correctamente");
  }
};

export const ExportarASupaBD = async () => {
  db.transaction(async (tx) => {
    tx.executeSql(
      `SELECT * FROM Horas WHERE IsBackedInSupabase = 0`,
      [],
      (_, { rows }) => {
        rows._array.forEach(async (registro) => {
          await RespaldarRegistroEnSupa(registro);
        });
      },
      (_, error) => {
        console.log("Error al obtener las horas:", error);
        return true; // Indica que el error fue manejado
      }
    );
  });
};

export const BorrarTSemHoras = async () => {
  db.transaction(async (tx) => {
    // Borrar las tablas Horas y Semanas
    tx.executeSql(
      `DELETE FROM Horas`,
      [],
      () => {
        console.log("Contenido de la tabla Horas eliminado exitosamente");
      },
      (_, error) => {
        console.log("Error al eliminar el contenido de la tabla Horas:", error);
        return true; // Indica que el error fue manejado
      }
    );

    tx.executeSql(
      `DELETE FROM Semanas`,
      [],
      () => {
        console.log("Contenido de la tabla Semanas eliminado exitosamente");
      },
      (_, error) => {
        console.log(
          "Error al eliminar el contenido de la tabla Semanas:",
          error
        );
        return true; // Indica que el error fue manejado
      }
    );
  });
};

export const ImportarDeSupaBD = async () => {
  const Data = await ObtenerDatosUsuario();
  const Horas = await obtenerHoras(Data.Codigo);
  let idSemana;

  for (let i = 0; i < Horas.length; i++) {
    const hora = Horas[i];
    idSemana = await ChecarSemana(new Date(hora.DateInicio));
    db.transaction(async (tx) => {
      tx.executeSql(
        `INSERT INTO Horas (Inicio, Final, Total, idUsuario, IsBackedInSupabase, idSemana) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          hora.Inicio,
          hora.Final,
          hora.Total,
          hora.CodigoUsuario,
          parseInt("1", 10),
          idSemana,
        ],
        async (_, result) => {
          console.log("Registro de horas añadido");
        },
        (_, error) => {
          console.log("Error al añadir el registro de horas:", error);
          return true; // Indica que el error fue manejado
        }
      );
    });
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

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Semanas (Inicio, Fin, idUsuario) VALUES (?, ?, ?);`,
        [Inicio, Final, parseInt(usuario.Codigo, 10)],
        (_, result) => {
          console.log("Registro de semanas añadido con id:", result.insertId);
          resolve(result.insertId);
        },
        (_, error) => {
          console.log("Error al añadir el registro de semanas:", error);
          reject(error);
        }
      );
    });
  });
};

export const ChecarSemana = async (FRef) => {
  const data = await ObtenerDatosUsuario();
  const InicioS = await ObtenerIniSemana(FRef);
  const FinalS = await ObtenerFinSemana(FRef);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Semanas WHERE Inicio = ? AND Fin = ? AND idUsuario = ?`,
        [InicioS.toLocaleDateString(), FinalS.toLocaleDateString(), parseInt(data.Codigo, 10)],
        async (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0].id);
          } else {
            const id = await InsertarSemana(InicioS, FinalS);
            resolve(id);
          }
        },
        (_, error) => {
          console.error("Error al verificar el registro:", error);
          reject(error);
        }
      );
    });
  });
};

export const sumarTiempos = (tiempoStrings) => {
  let totalSegundos = 0;

  tiempoStrings.forEach((tiempo) => {
    // Validar que el tiempo tenga el formato correcto y evitar errores de NaN
    if (typeof tiempo === 'string' && tiempo.includes(":")) {
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

export default db;
