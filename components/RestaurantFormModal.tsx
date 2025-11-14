import { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

type Props = {
  visible: boolean;
  initialMenuLink?: string | null;
  coords?: { latitude: number; longitude: number } | null;
  onCancel: () => void;
  onSubmit: (payload: {
    restaurant_name: string;
    description: string;
    menu_link: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
  }) => Promise<void> | void;
};

export default function RestaurantFormModal({ visible, initialMenuLink, coords, onCancel, onSubmit }: Props) {
    
    const [restaurant_name, setRestaurant_name] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const [showPicker, setShowPicker] = useState(false);

    function clearRestaurant() {
        setRestaurant_name("");
        setDescription("");
        setLocation("");
    };

    return (
        <Modal transparent={false}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <>
                        <View style={styles.qrPreview}>
                            <Text style={styles.qrText}>{scannedURL}</Text>
                        </View>

                        <TextInput
                            placeholder="Restaurant name..."
                            value={restaurant_name}
                            onChangeText={setRestaurant_name}
                            style={styles.input}
                            placeholderTextColor="#aaa"
                        />
                        <Pressable
                            onPress={() => setShowPicker(true)}
                            style={styles.input}
                        >
                            <Text style={{ color: description ? "white" : "#aaa", fontSize: 16 }}>
                            {description || "Selecciona una categoria..."}
                            </Text>
                        </Pressable>

                        {/* Modal que muestra el Picker */}
                        <Modal
                            visible={showPicker}
                            transparent
                            animationType="slide"
                            onRequestClose={() => setShowPicker(false)}
                        >
                            <View style={styles.modalOverlay}>
                            <View style={styles.pickerModal}>
                                <Picker
                                selectedValue={description}
                                onValueChange={(val) => {
                                    setDescription(val);
                                    setShowPicker(false); // cerrar al elegir
                                }}
                                style={styles.picker}
                                dropdownIconColor="#fff"
                                >
                                <Picker.Item label="Merienda" value="Merienda" />
                                <Picker.Item label="Bodegon" value="Bodegon" />
                                <Picker.Item label="Restaurante" value="Restaurante" />
                                <Picker.Item label="Bar" value="Bar" />
                                <Picker.Item label="Comida Rápida" value="Comida rapida" />
                                </Picker>
                            </View>
                            </View>
                        </Modal>
                        <TextInput
                            placeholder="Location..."
                            value={location}
                            onChangeText={setLocation}
                            style={styles.input}
                            placeholderTextColor="#aaa"
                        />

                        <Pressable style={styles.primaryButton} onPress={handleAddRestaurant}>
                            <Text style={styles.buttonText}>Add Restaurant</Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => {
                            clearRestaurant();
                            setScanned(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </>
                </View>
            </View>
        </Modal>
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
    backgroundColor: "rgba(17, 110, 191, 0.8)", // azul intermedio translúcido
    padding: 10,
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
