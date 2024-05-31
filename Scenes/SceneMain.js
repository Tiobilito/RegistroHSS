import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Dimensions, TextInput, SafeAreaView } from "react-native";
import { CommonActions } from "@react-navigation/native";
import db, { IniciarTiempoUsuario, añadirHoras } from "../Modulos/db";
import { Cronometro } from "../Modulos/Cronometro";
import { getGlobalData, setGlobalData } from "../Modulos/getUser";
import { supabase } from "../Modulos/supabase";



const Scale = Dimensions.get("window").width;

export default function Main({ navigation }) {
  const [user, SetUser] = useState("");
  const [password, SetPassword] = useState("");

  function hola() {
    console.log("hola");
    console.log(user)
    console.log(password)
    findDB()
    // Puedes agregar aquí más lógica si lo necesitas
  }
  async function findDB(){


    const {data,error}=await supabase.from("usuarios2").select("*").eq('nombre',user).eq('codigo',password)
    if(error){

      console.log("hubo un error: " + error)
    }
    if(data.length>0 ){

    console.log("hay datos=",data)
    setGlobalData("user",user)
               
    navigation.navigate('Inicio')
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      })
    );

    }else{
          console.log("El usuario no existe")
    }


  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.text2}>
        <Text style={styles.text}>Hola bienvenido al programa de horas, por favor, logeate</Text>
        <TextInput
          style={styles.input}
          onChangeText={SetUser}
          value={user}
          placeholder="Usuario"
        />
        <TextInput
          style={styles.input}
          onChangeText={SetPassword}
          placeholder="Contraseña"
          secureTextEntry 
        />
        <Button
          color="blue"
          title="Iniciar tiempo"
          onPress={() => {
            hola();
            // Reemplaza esto con la navegación que deseas
             /*navigation.dispatch(
             CommonActions.reset({
                index: 0,
                routes: [{ name: "Tab" }],
              })
            );*/
          }}
        />
        <Button 
        color="red"
        title="Registro"
        
        onPress={()=>{ 
          navigation.dispatch(
            CommonActions.reset({
               index: 0,
               routes: [{ name: "Registro" }],
             })
           );}
          

         
        }/>


        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text2: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 20,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%', // Para que el input tenga un ancho razonable
  },
});
