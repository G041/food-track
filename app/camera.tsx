import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

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

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    console.log(`Scanned ${type}: ${data}`);
    setSeleccionado(data);
  };

  const renderCamera = () => {
    return (
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

        <Modal visible={seleccionado !== null} transparent={true}>
          <View style={styles.modalBackgroundStyles}>
            <View style={styles.containerStyles}>
              {seleccionado ?
                <>  
                  <View style={styles.textBackgroundStyle}>
                    <Text>{seleccionado}</Text>
                  </View>
  
                  <Pressable style={styles.cancelButtonStyles} onPress={() => {setSeleccionado(null); setScanned(false)}}>
                    <Text style={styles.buttonTextStyle}>Cerrar</Text>
                  </Pressable>
                </>
                : null}
            </View>
          </View>
        </Modal>
      </View>
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
    height: "8%",
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
  }
});