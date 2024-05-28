import {React,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {supabase} from "./supabase"

async function conexion() {
    console.log("enter")
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) {
    console.log('Algo salió mal:', error);
    return
  } 
    console.log('Data:', data[0]);
   
  }

  
export default function DB() {
    console.log("hola")
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
