import { AppDispatch } from "@/store";
import { addRestaurantThunk } from "@/store/restaurantsSlice";
import { Picker } from "@react-native-picker/picker";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

import { CATEGORIES } from "@/types/categories";
import { Marker, Region } from "react-native-maps";
import MapViewer from "./MapViewer";

type Props = {
  visible: boolean;
  setScanned: React.Dispatch<React.SetStateAction<boolean>>;
  initialMenuLink: string;
  coords?: { latitude: number; longitude: number } | null;
};

const defaultPosition: Region = {
  latitude: -34.61,
  longitude: -58.44,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1
};

export default function RestaurantFormModal({ visible, initialMenuLink, coords, setScanned }: Props) {
    
    const dispatch = useDispatch<AppDispatch>();

    const [restaurant_name, setRestaurant_name] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pickedCoords, setPickedCoords] = useState<{ latitude: number; longitude: number } | null >(null);

    const [showPicker, setShowPicker] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showFormModal, setShowFormModal] = useState(visible);

    //ubicacion default 
    const [userRegion, setUserRegion] = useState<Region>(defaultPosition);

    useEffect(() => {
      setShowFormModal(visible);
    }, [visible]);

    function clearRestaurant() {
        setRestaurant_name("");
        setDescription("");
        setLocation("");
        setPickedCoords(null);

        setScanned(false);
    };

    const handleAddRestaurant = async () => {
      const finalCoords = pickedCoords ?? coords ?? null;

      const newRestaurant = {
        restaurant_name,
        description,
        menu_link: initialMenuLink,
        location,
        latitude: finalCoords?.latitude ?? null,
        longitude: finalCoords?.longitude ?? null,
      };

      try {
          const action = await dispatch(addRestaurantThunk(newRestaurant));
          const result = unwrapResult(action); // optional: throws if rejected

          // console.log("Restaurant added successfully:", result);

          // reset forms
          clearRestaurant();
      } catch (err) {
          console.error("Failed to add restaurant:", err);
          clearRestaurant();
      }
    };

    const handleSelectLocation = () => {
      setUserRegion({
        latitude: coords?.latitude ?? defaultPosition.latitude,
        longitude: coords?.longitude ?? defaultPosition.longitude,
        latitudeDelta: defaultPosition.latitudeDelta,
        longitudeDelta: defaultPosition.longitudeDelta,
      });

      setShowFormModal(false); // escondo form
      setShowMap(true);       // mmuestro mapa
    }

    const renderPickedMarker = () => {
      return (
        <>
          {pickedCoords && (
            <Marker
              coordinate={pickedCoords}
              draggable
              onDragEnd={(e) =>
                setPickedCoords(e.nativeEvent.coordinate)
              }
            />)}
        </>
      )
    }

    return (
      <>
        <Modal transparent={false} visible={showFormModal}>
            <View style={styles.modalBackground}>
                <View style={styles.qrPreview}>
                    <Text style={styles.qrText}>{initialMenuLink}</Text>
                </View>
                <View style={styles.disclaimerPreview}>
                    <Text style={styles.qrText}>Si no especificas una ubicación, se elegirá tu posición actual por default.</Text>
                </View>
                <TextInput
                    placeholder="Nombre del restaurante..."
                    value={restaurant_name}
                    onChangeText={setRestaurant_name}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    placeholder="Dirección..."
                    value={location}
                    onChangeText={setLocation}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <Pressable
                    onPress={() => setShowPicker(true)}
                    style={styles.input}
                >
                    <Text style={{ color: description ? "white" : "#aaa", fontSize: 20 }}>
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
                          {CATEGORIES.map(cat => (
                            <Picker.Item key={cat} label={cat} value={cat} />
                          ))}
                        </Picker>
                    </View>
                    </View>
                </Modal>

                <Pressable style={styles.secondaryButton} onPress={handleSelectLocation}>
                    <Text style={styles.buttonText}>Especificar ubicación</Text>
                </Pressable>

                <Pressable style={styles.primaryButton} onPress={handleAddRestaurant}>
                    <Text style={styles.buttonText}>Añadir restaurante</Text>
                </Pressable>

                <Pressable style={styles.cancelButton} onPress={clearRestaurant}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
            </View>
        </Modal>
        <Modal
            visible={showMap}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setShowMap(false)}
        >
            <View style={{ flex: 1 }}>                
                <MapViewer 
                  region={userRegion}
                  onMapLongPress={setPickedCoords}
                  renderMarkers={renderPickedMarker}
                />

                <Pressable
                    style={styles.mapButton}
                    onPress={() => {
                      setShowMap(false);
                      setShowFormModal(true);
                    }}
                >
                    <Text style={{ color: "white" }}>Confirmar ubicación</Text>
                </Pressable>
            </View>
        </Modal>
      </>
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
    backgroundColor: "#0D3973",
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
    textAlign: "center",
    color: "white",
  },

  disclaimerPreview: {
    padding: 10,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#188FD9",
    borderColor: "#1EA4D9",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: "85%",
    height: 50,
    fontSize: 20,
    marginVertical: 8,
    color: "white",
  },

  primaryButton: {
    backgroundColor: "#1EA4D9",
    width: "80%",
    height: 60,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#0D3973",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  secondaryButton: {
    backgroundColor: "#188FD9",
    width: "80%",
    height: 50,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  cancelButton: {
    backgroundColor: "#ff2f2fff",
    width: "80%",
    height: 45,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  mapButton: {
    backgroundColor: "#188FD9",
    width: "40%",
    height: 45,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,

    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    padding: 12,
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
