import RestaurantFormModal from "@/components/RestaurantFormModal";
import { useCameraScanner } from "@/hooks/useCameraScanner";
import { RootState } from "@/store";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";

export default function Camera() {

  const router = useRouter();

  // read auth state from Redux
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn);
  const isLoading = useSelector((s: RootState) => s.auth.isLoading);

  const [scanned, setScanned] = useState(false);

  const { permission, requestPermission, ref, facing, toggleFacing, handleBarcodeScanned, scannedURL, coords } = useCameraScanner(scanned, setScanned);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Escanear un QR</Text>
        </Pressable>
      </View>
    );
  }

  return !isLoggedIn ? (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 15}}>No has iniciado sesión</Text>
        <Pressable onPress={() => router.push("/home")} style={ styles.primaryButton } >
          <Text style={{ color: "white" }}>Ir a pantalla de Login</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              zoom={0.14386}
              ref={ref}
              facing={facing}
              responsiveOrientationWhenOrientationLocked
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.shutterContainer}>
              <Pressable style={styles.flipBtn} onPress={toggleFacing}>
                <FontAwesome6 name="rotate-left" size={32} color="#fff" />
              </Pressable>
            </View>

            <RestaurantFormModal
              visible={scanned}
              initialMenuLink={scannedURL}
              coords={coords}
              setScanned={setScanned}
            />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C0526", // fondo violeta oscuro
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
    alignItems: "center",
    justifyContent: "center",
  },

  flipBtn: {
    position: "absolute",
    right: 30,
    bottom: -10,
    backgroundColor: "rgba(17, 110, 191, 0.8)", // azul intermedio translúcido
    padding: 15,
    borderRadius: 50,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#0D3973", // azul profundo
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#1EA4D9",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  qrPreview: {
    alignItems: "center",
    backgroundColor: "#116EBF",
    borderWidth: 2,
    borderColor: "#1EA4D9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  qrText: {
    fontWeight: "bold",
    color: "white",
  },

  input: {
    backgroundColor: "#188FD9",
    borderColor: "#1EA4D9",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "85%",
    fontSize: 18,
    marginVertical: 8,
    color: "white",
  },

  primaryButton: {
    backgroundColor: "#1EA4D9",
    width: "80%",
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#0D3973",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  cancelButton: {
    backgroundColor: "#116EBF",
    width: "80%",
    height: 45,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  pickerContainer: {
    backgroundColor: "#188FD9",
    borderColor: "#1EA4D9",
    borderWidth: 1,
    borderRadius: 8,
    width: "85%",
    marginVertical: 8,
    // para que coincida con el alto del input
    height: 50,
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  pickerModal: {
    backgroundColor: "#188FD9",
    borderRadius: 10,
    borderColor: "#1EA4D9",
    borderWidth: 1,
    width: "85%",
    padding: 10,
  },

  picker: {
    color: "#fff",
    height: 200,
  },

});
