import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    TextInput,
    Alert,
} from "react-native";
import { useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { changePassword,checkUser } from "../Modulos/OperacionesBD";


const Scale = Dimensions.get("window").width;



export default function ChangePassword({ navigation }) {
    const [step, setStep] = useState(1); // Para controlar qué paso mostrar
    const [code, setCode] = useState("");

    const [password,setPassword]=useState("")
    const [newPassword,setnewPassword]=useState("")



 async function verificationUser(){

   const get=await checkUser(code)
   if(get ==true){
""
    console.log("siiiii")
    setStep(2)
    
   }
   else{

    Alert.alert("El usuario no xiste:(")
   }


 }
    async function verification(){

    
        if(password===newPassword){

            Alert.alert("las contrasenas son iguales")
           const changes=await changePassword(password,code)
         
        }
        else{

         Alert.alert("Las contrasenas no son iguales :(")
        }
    }
    return (
        <View style={styles.container}>
            {step===1 && (<>
            
                <TextInput 
                style={styles.textInput} 
                placeholder="Codigo"
                placeholderTextColor="#888"
                value={code}
                onChangeText={(text)=>{

                    setCode(text)
                }}
                
            />
            <Button title="cambiar la contrasena" onPress={() => verificationUser()} />
            </>) 
            
            
            }
            {step==2 && (
                
                <>
                <Text style={styles.text}>Escribe la nueva contraseña</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Contraseña"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <Text style={styles.text}>Escribe nuevamente la contraseña</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Contraseña"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={(text) => setnewPassword(text)}
                    />
                    <Button title="Cambiar la contraseña" onPress={verification} />
            
            
            
            
            </>)}
          
             
          
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: Scale > 400 ? 50 : 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "black",
    },
    textInput: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
