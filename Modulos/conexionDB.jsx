import { React, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from "./supabase"
import { getGlobalData } from './getUser';

export async function conexion() {

  const { data, error } = await supabase.from('usuarios2').select('*');
  if (error) {
    console.log('Algo salió mal:', error);
    return
  }
  console.log('Data:', data[0]);
  const user = getGlobalData('user');
  console.log("El usuario es", user)
  //console.log("el usuario de la base de dartos es=", data[0].nombre)
  return data
  if (data[0].nombre == user) {

    console.log("el usuario si esta ")
  } else {

    console.log("el usaurio no esta")
  }

}


export async function saveDateDB(Nombre,tipoUsuario,codigo) {
  const { data, error } = await supabase.from("usuarios2").insert([{ codigo: codigo, nombre: Nombre, tipo: tipoUsuario }])
  if (error) {
    console.log("Hubo un error", error)
    return
  }
  console.log("Los datos a la base de datos se actualizaron", data)

}

export async function saveDateDBHours(inicio,fin){

  const { data, error } = await supabase.from("horas").insert([{ inicio : inicio, fin: fin }])
  if (error) {
    console.log("Hubo un error", error)
    return
  }
  console.log("Los datos a la base de datos se actualizaron", data)

}




export default function DB() {

  useEffect(() => {
    conexion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Consulta de Base de Datos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
