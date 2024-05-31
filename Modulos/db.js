import * as SQLite from "expo-sqlite/legacy";
import React, { useState, useEffect } from "react";
import { saveDateDBHours, conexion } from "./conexionDB";

const db = SQLite.openDatabase("Horario.db");

const MyComponent = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await conexion();
      if (user) {
        setDates(user);
      }
    };

    fetchData();
  }, []);

  

  // Resto de las funciones y lógica aquí...

  return (
    <div>
      {/* Tu componente JSX aquí... */}
    </div>
  );
};

export const añadirHora = async() => {
  const usuario = "rauf";
  //const esperar= await conexion()
  console.log(usuario);
  const inicio = new Date(usuario);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  const total = calcularDiferenciaHoras(inicio, fin);
  console.log({ inicioFormateado, finFormateado, total });
  conexion()

};

export async function añadirHoras (){
  console.log("entrad a la funcion horas ")
 
  try {
    console.log("antes del wait")
    const data = await conexion();
    if (data) {
      console.log("Datos recibidos:", data[0].inicio);
      saveDateDBHours(data[0].inicio,data[0].inicio)
      
    } else {
      console.log("No se recibieron datos.");
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }

}
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
        CREATE TABLE IF NOT EXISTS Horas (
          ID INTEGER NOT NULL UNIQUE,
          Inicio TEXT,
          Final TEXT,
          Total TEXT,
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

export const IniciarTiempoUsuario = (TiempoInicio) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE Usuarios SET Inicio = ? WHERE ID = (SELECT ID FROM Usuarios ORDER BY ID ASC LIMIT 1);`,
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

const calcularDiferenciaHoras = (inicio, fin) => {
  const diffMs = fin - inicio;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  return `${diffHrs.toString().padStart(2, "0")}:${diffMins
    .toString()
    .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;
};

export default db;
