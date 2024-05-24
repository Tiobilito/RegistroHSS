import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('Horario.db');

// Función para inicializar la base de datos y crear tablas si no existen
const initializeDatabase = () => {
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
      () => { console.log('Tabla Horas ya existe'); },
      (_, error) => { console.log('Error al crear la tabla Horas:', error); return true; }
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
      () => { console.log('Tabla ya existe'); },
      (_, error) => { console.log('Error al crear la tabla Usuarios:', error); return true; }
    );
  });
};

// Llamar a la función para inicializar la base de datos
initializeDatabase();

export default db;