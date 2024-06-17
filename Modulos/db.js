import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("Horario.db");

// Inicializa la base de datos
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE "Usuarios" (
          "id"	INTEGER NOT NULL,
          "Nombre"	TEXT NOT NULL,
          "Tipo"	TEXT NOT NULL,
          "Inicio"	TEXT,
          "Contraseña"	TEXT NOT NULL,
          "idDepartamento"	INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY("id")
        );
      `,
      [],
      null,
      (_, error) => {
        console.log("Error al crear la tabla Usuarios:", error);
        return true;
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE "Horas" (
          "id"	INTEGER NOT NULL UNIQUE,
          "Inicio"	TEXT,
          "Final"	TEXT,
          "Total"	TEXT,
          "idUsuario"	INTEGER NOT NULL,
          FOREIGN KEY("idUsuario") REFERENCES "Usuarios"("id"),
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

// Añade el usuario principal
export const AñadeUsuario = (Codigo, Nombre, tipoUsuario) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Usuarios (id, Nombre, Tipo) VALUES (?, ?, ?);`,
      [parseInt(Codigo, 10), Nombre, tipoUsuario],
      (_, result) => {
        console.log("Usuario insertado correctamente");
      },
      (_, error) => {
        console.log("Error al insertar usuario:", error);
        return true;
      }
    );
  });
};

// Borra todos los usuarios
export const borrarUsuarios = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM Usuarios;`,
      [],
      (_, result) => {
        console.log(
          "Todos los registros de la tabla Usuarios han sido borrados."
        );
      },
      (_, error) => {
        console.log(
          "Error al borrar los registros de la tabla Usuarios:",
          error
        );
        return true; // Indica que el error fue manejado
      }
    );
  });
};

// Inicia el tiempo
export const IniciarTiempoUsuario = (TiempoInicio) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE Usuarios SET Inicio = ? WHERE id = (SELECT id FROM Usuarios ORDER BY id ASC LIMIT 1);`,
      [TiempoInicio],
      (_, result) => {
        console.log("El tiempo de inicio ha sido registrado.");
      },
      (_, error) => {
        console.log("Error al iniciar el tiempo de inicio.", error);
        return true; // Indica que el error fue manejado
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
export const añadirHoras = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT ID, Inicio FROM Usuarios WHERE ID = (SELECT ID FROM Usuarios ORDER BY ID ASC LIMIT 1);`,
      [],
      (_, { rows }) => {
        if (rows.length > 0) {
          const usuario = rows._array[0];
          const inicio = new Date(usuario.Inicio);
          const fin = new Date();
          const inicioFormateado = formatearFechaHora(inicio);
          const finFormateado = formatearFechaHora(fin);
          const total = calcularDiferenciaHoras(inicio, fin);

          tx.executeSql(
            `INSERT INTO Horas (Inicio, Final, Total) VALUES (?, ?, ?);`,
            [inicioFormateado, finFormateado, total],
            (_, result) => {
              console.log("Registro de horas añadido con ID:", result.insertId);
              tx.executeSql(
                `UPDATE Usuarios SET Inicio = NULL WHERE ID = ?;`,
                [usuario.ID],
                (_, result) => {
                  console.log("Campo Inicio del usuario actualizado a NULL.");
                },
                (_, error) => {
                  console.log(
                    "Error al actualizar el campo Inicio del usuario:",
                    error
                  );
                  return true; // Indica que el error fue manejado
                }
              );
            },
            (_, error) => {
              console.log("Error al añadir el registro de horas:", error);
              return true; // Indica que el error fue manejado
            }
          );
        }
      },
      (_, error) => {
        console.log("Error al obtener la fecha de inicio del usuario:", error);
        return true; // Indica que el error fue manejado
      }
    );
  });
};

export default db;
