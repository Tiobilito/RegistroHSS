import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("Horario.db");

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
