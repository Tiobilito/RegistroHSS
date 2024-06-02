import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import { Cronometro } from "../Modulos/Cronometro";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";
import { supabase } from "../Modulos/supabase";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [database, setDatabase] = useState([]);

  const tomarUsuario = async () => {
    let CodigoUsuario = ObtenerDatosUsuario();
    const { data, error } = await supabase
      .from("usuarios2")
      .select("*")
      .eq("codigo", CodigoUsuario);
    if (error) {
      console.log("Error al buscar el usuario:", error);
    } else {
      console.log("Datos obtenidos de la base de datos:", data);
      setDatabase(data);
    }
  };

  async function O() {}

  useEffect(() => {
    tomarUsuario();
  }, []);

  console.log("Estado de la base de datos:", database.inicio);

  return (
    <View style={styles.container}>
      {usuario ? (
        <View>
          <Text style={styles.text}>
            Hola {usuario} a la app de registro de horas para{" "}
            {database.length > 0 && database[0].nombre}
          </Text>
          {MostrarCr ? (
            <View>
              <Button
                color="red"
                title="Detener tiempo"
                onPress={() => {
                  añadirHoras();
                  DefMostrarCr(false);
                }}
              />
              <Cronometro startDate={FechaInicio} />
            </View>
          ) : (
            <View>
              <Button
                color="blue"
                title="Iniciar tiempo"
                onPress={() => {
                  const now = new Date();
                  DefFechaInicio(now);
                  IniciarTiempoUsuario(now.toISOString());
                  DefMostrarCr(true);
                }}
              />
            </View>
          )}
        </View>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Content: {
    margin: 50,
  },
  Boton: {
    color: "red",
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    margin: 20,
    color: "black",
  },
});
