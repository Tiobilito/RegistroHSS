import {React,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {supabase} from "./supabase"

export async function conexion(nombre,tipo) {
    
  const { data, error } = await supabase.from('usuarios2').select('*');
  if (error) {
    console.log('Algo salió mal:', error);
    return
  } 
    console.log('Data:', data);
   
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
