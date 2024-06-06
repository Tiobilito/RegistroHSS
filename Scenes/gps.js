import {useState,useEffect} from "react"
import { StyleSheet,View,TextInput,Button,Alert } from "react-native"
import * as Location from "expo-location"
import { StatusBar } from 'expo-status-bar';


export const obtenerUbicacion = async () => {

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return null;
      }
  
      let location = await Location.getCurrentPositionAsync({});
    //  console.log('La localización es=', location);
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      });
      //console.log("Reverse Geocoded:");
      //console.log(reverseGeocodedAddress);

      return reverseGeocodedAddress;
    } catch (error) {
      console.error('Error obteniendo la localización:', error);
      Alert.alert(
        'Permiso denegado',
        'Para usar la aplicacion necesuitas darme tu ubicacion. ¿Quieres intentarlo de nuevo?',
        [
          
          { text: 'Reintentar', onPress: () => obtenerUbicacion() }
        ]
      );
      return null;
    }
     
   

 
     

  };


  export function Gps() {
    const [location, setLocation] = useState();
    const [address, setAddress] = useState();

  
    useEffect(() => {
      const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("Please grant location permissions");
          return;
        }
  
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log("Location:");
        console.log(currentLocation);
      };
      getPermissions();
    }, []);
  
    const geocode = async () => {
      const geocodedLocation = await Location.geocodeAsync(address);
      console.log("Geocoded Address:");
      console.log(geocodedLocation);
    };
  
    const reverseGeocode = async () => {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      });
  
      console.log("Reverse Geocoded:");
      console.log(reverseGeocodedAddress);
    };
  
    return (
      <View style={styles.container}>
        <TextInput placeholder='Address' value={address} onChangeText={setAddress} />
        <Button title="Geocode Address" onPress={geocode} />
        <Button title="Reverse Geocode Current Location" onPress={reverseGeocode} />
        <StatusBar style="auto" />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });