import * as SQLite from "expo-sqlite/legacy";
import { Alert } from "react-native";

const db = SQLite.openDatabase("Horario.db");

//Inicializa la base de datos
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE IF NOT EXISTS Horas (
          ID INTEGER NOT NULL UNIQUE,
          Inicio TEXT,
          Final TEXT,
          Total REAL,
          PRIMARY KEY(ID AUTOINCREMENT)
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
        CREATE TABLE IF NOT EXISTS Usuarios (
          ID INTEGER NOT NULL UNIQUE,
          Nombre TEXT NOT NULL,
          Tipo TEXT NOT NULL,
          Inicio TEXT,
          PRIMARY KEY(ID AUTOINCREMENT)
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
};

//Añade el usuario principal
export const AñadeUsuario = (Nombre, tipoUsuario) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Usuarios (Nombre, Tipo) VALUES (?, ?);`,
      [Nombre, tipoUsuario],
      (_, result) => {
        console.log("Usuario insertado con ID:", result.insertId);
      },
      (_, error) => {
        console.log("Error al insertar usuario:", error);
        return true;
      }
    );
  });
};

//Borra todos los usuarios
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

//Inicia el tiempo
export const IniciarTiempoUsuario = (TiempoInicio) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE Usuarios SET Inicio = ? WHERE ID = (SELECT ID FROM Usuarios ORDER BY ID ASC LIMIT 1);`,
      [TiempoInicio],
      (_, result) => {
        console.log("El tiempo de inicio ha sido registrado.");
      },
      (_, error) => {
        console.log(
          "Error al iniciar el tiempo de inicio.",
          error
        );
        return true; // Indica que el error fue manejado
      }
    );
  });
};

export default db;
