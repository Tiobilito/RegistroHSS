import * as SQLite from "expo-sqlite/legacy";

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
  if (Nombre != "" && tipoUsuario != "") {
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
    navigation.navigate("Tab");
  } else {
    Alert.alert("Por favor rellene todos los datos");
  }
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

export default db;
