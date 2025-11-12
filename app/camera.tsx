import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import * as Location from "expo-location"; //location save on submit
import { Alert } from "react-native"; //location save on submit


import { API_URL } from '../utils/config';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const [restaurant_name, setRestaurant_name] = useState("");
  const [description, setDescription] = useState("");
  const [menu_link, setMenu_link] = useState("");
  const [location, setLocation] = useState(""); 

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null); //location save on submit


  // Quisimos pero no pudimos que el permiso te lo pida al entrar por primera vez a la pestaña, y q el boton 
  // solo aparezca si en esa le denegaste permiso

  if (!permission) {
    return null;
  }

  if (!permission.granted) { 
    return ( 
      <View style={styles.container}> 
        <Pressable style={styles.buttonStyles} onPress={requestPermission}>
          <Text style={styles.buttonTextStyle}>Escanear un QR</Text>
        </Pressable>
      </View> 
    ); 
  }

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
  if (scanned) return;
  setScanned(true);
  console.log(`Scanned ${type}: ${data}`);
  setMenu_link(data);
  setSeleccionado(data);

  // Ask for location & read it
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Location permission denied", "You can still fill the form, but coordinates won't be saved.");
    setCoords(null);
    return;
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
};


  const handleAddRestaurant = async () => {
  try {
    const newRestaurant = {
      restaurant_name,
      description,
      menu_link,
      location,                      // keep if you still want a human-readable address
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    };

    const response = await fetch(`${API_URL}/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRestaurant),
    });

    const data = await response.json();
    console.log("Successfully added restaurant:", data);

    // reset
    setRestaurant_name(""); setDescription(""); setMenu_link(""); setLocation("");
    setCoords(null);
    setSeleccionado(null); setScanned(false);
  } catch (error) {
    console.error("Error when trying to add new restaurant:", error);
  }
};


  const renderCamera = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={ref}
            facing={facing}
            responsiveOrientationWhenOrientationLocked
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"], 
            }}
          />
          <View style={styles.shutterContainer}>
            <Pressable style={styles.flipBtn} onPress={toggleFacing}>
              <FontAwesome6 name="rotate-left" size={32} color="white" />
            </Pressable>
          </View>

          <Modal visible={seleccionado !== null} transparent={false}>
            <View style={styles.modalBackgroundStyles}>
              <View style={styles.containerStyles}>
                {seleccionado ?
                  <>  
                    <View style={styles.textBackgroundStyle}>
                      <Text>{seleccionado}</Text>
                    </View>

                    <TextInput
                      placeholder="Restaurant name..."
                      value={restaurant_name}
                      onChangeText={setRestaurant_name}
                      autoCorrect={false}         
                      spellCheck={false}  
                      style={styles.inputStyle}
                    />
                    <TextInput
                      placeholder="Description..."
                      value={description}
                      onChangeText={setDescription}
                      style={styles.inputStyle}
                    />
                    <TextInput
                      placeholder="Location..."
                      value={location}
                      onChangeText={setLocation}
                      style={styles.inputStyle}
                    />

                    <Pressable style={styles.buttonStyles} onPress={handleAddRestaurant}>
                      <Text style={styles.buttonTextStyle}>Add Restaurant</Text>
                    </Pressable>
    
                    <Pressable style={styles.cancelButtonStyles} onPress={() => {setSeleccionado(null); setScanned(false)}}>
                      <Text style={styles.buttonTextStyle}>Cancel</Text>
                    </Pressable>
                  </>
                  : null}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraContainer: StyleSheet.absoluteFillObject,

  camera: StyleSheet.absoluteFillObject,

  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  flipBtn: {
    position: "absolute",
    right: 30,    
  },

  containerStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },

  textStyle: {
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 10
  },

  buttonTextStyle: {
    color: "white",
    fontSize: 20,
  },

  inputStyle:{
    color: "black",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "85%",
    height: "10%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
  },

  buttonStyles: {
    backgroundColor: "rebeccapurple",
    width: "80%",
    height: "15%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  },

  cancelButtonStyles: {
    backgroundColor: "darkred",
    width: "80%",
    height: "8%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  },

  itemStyles: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  },

  imageStyles: {
    width: 150, 
    height: 150, 
    marginRight: 10
  },

  modalBackgroundStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  textBackgroundStyle: {
    alignItems: "center",
    width: 200,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderBlockColor: "black",
    borderWidth: 2
  },

});