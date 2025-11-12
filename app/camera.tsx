import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { API_URL } from "../utils/config";

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
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

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

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    console.log(`Scanned ${type}: ${data}`);
    setMenu_link(data);
    setSeleccionado(data);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se guardará sin coordenadas.");
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
        location,
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

      setRestaurant_name("");
      setDescription("");
      setMenu_link("");
      setLocation("");
      setCoords(null);
      setSeleccionado(null);
      setScanned(false);
    } catch (error) {
      console.error("Error when trying to add new restaurant:", error);
    }
  };

  const renderCamera = () => (
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
            <FontAwesome6 name="rotate-left" size={32} color="#fff" />
          </Pressable>
        </View>

        <Modal visible={seleccionado !== null} transparent={false}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {seleccionado && (
                <>
                  <View style={styles.qrPreview}>
                    <Text style={styles.qrText}>{seleccionado}</Text>
                  </View>

                  <TextInput
                    placeholder="Restaurant name..."
                    value={restaurant_name}
                    onChangeText={setRestaurant_name}
                    style={styles.input}
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    placeholder="Description..."
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    placeholder="Location..."
                    value={location}
                    onChangeText={setLocation}
                    style={styles.input}
                    placeholderTextColor="#999"
                  />

                  <Pressable style={styles.primaryButton} onPress={handleAddRestaurant}>
                    <Text style={styles.buttonText}>Add Restaurant</Text>
                  </Pressable>

                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => {
                      setSeleccionado(null);
                      setScanned(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );

  return <View style={styles.container}>{renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#400101",
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
    backgroundColor: "rgba(115, 2, 2, 0.7)",
    padding: 10,
    borderRadius: 50,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#F2A413",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  qrPreview: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#D9601A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },

  qrText: {
    fontWeight: "bold",
    color: "#400101",
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#D9601A",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "85%",
    fontSize: 18,
    marginVertical: 8,
    color: "#400101",
  },

  primaryButton: {
    backgroundColor: "#D9601A",
    width: "80%",
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  cancelButton: {
    backgroundColor: "#730202",
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
});
