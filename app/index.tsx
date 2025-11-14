import { Ionicons } from "@expo/vector-icons"; //para el boton que centra la ubicacion
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Keyboard, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { WebView } from "react-native-webview";

import * as Location from "expo-location";
import type { Region } from "react-native-maps";
import MapView, { Circle, Marker } from "react-native-maps";

import { type Category } from "@/constants/categories";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import DropDownMenu from "@/components/DropDownMenu";
import { API_URL } from "../utils/config";

type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description?: "Merienda" | "Bodegon" | "Restaurante" | "Bar" | "Comida Rapida" | string;
  menu_link: string;
  latitude: number;   // por si vienen nulos en la primera migración
  longitude: number;
  
};

// Región con accuracy opcional (para el círculo)
type RegionWithAccuracy = Region & { accuracy?: number | null }; 

export default function Map() {

  const [selectedCat, setSelectedCat] = useState<Category>("Todos"); // Category igual a: "Todos" | "Merienda" | "Bodegon" | ...

  // --- estado existente tuyo (filtro, modal, restaurantes, etc.) ---
  const [filtro, setFiltro] = useState("");
  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<MapView>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  
  // --- NUEVO: región del usuario ---
  const [region, setRegion] = useState<RegionWithAccuracy | null>(null);

  const insets = useSafeAreaInsets();
  // topOffset ensures the overlay sits below the notch/status bar
  const topOffset = insets.top + 10; // tweak +10 or +12 for spacing

  const normalize = (s: string) =>  //otra implementacion del filter
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const isCategoryMatch = (desc: string | undefined | null) => {
    if (selectedCat === "Todos") return true;
    if (!desc) return false;
    // match *exacto* contra la categoría elegida, ignorando acentos/case
    return normalize(desc) === normalize(selectedCat);
  };

  // 1) pedir ubicación y setear initialRegion
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permiso de ubicación denegado");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        accuracy: loc.coords.accuracy, // ahora coincide con el tipo
      });
    })();   
  }, []);

  // 2) tu fetch de restaurantes (igual que antes)
  useFocusEffect(
    useCallback(() => {
      async function fetchRestaurants() {
        try {
          const res = await fetch(`${API_URL}/restaurants`);
          const data = await res.json();
          setRestaurants(data);
        } catch (err) {
          console.error("Error fetching restaurants:", err);
        }
      }
      fetchRestaurants();
    }, [])
  );

  // 3) filtrados (tu lógica)
  const filtrados = restaurants
    .filter((r) =>
      r.restaurant_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
    )
    .filter((r) => isCategoryMatch(r.description));


  const centerOnUser = () => {
  if (!region || !mapRef.current) return;

  mapRef.current.animateToRegion(
    {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    500 // duración animación en ms
    );
  };

  // Si aún no tengo region, podés mostrar un placeholder simple
  if (!region) return <View style={{ flex: 1, backgroundColor: "#0b1523" }} />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {/* MAPA */}
        {Platform.OS === "ios" ? (
          <MapView
            style={styles.map}
            initialRegion={region}
            ref = {mapRef}
            showsUserLocation
            showsPointsOfInterest={false}
            mapType="mutedStandard"
            compassOffset={{ x: -10, y: insets.top + 20 }}
          >
            <Pressable onPress={centerOnUser} style={styles.locationButton}>
              <Ionicons name="locate" size={28} color="black" />
            </Pressable>
            {/* Círculo de precisión opcional */}
            {region.accuracy !== undefined && (
              <Circle
                center={{ latitude: region.latitude, longitude: region.longitude }}
                radius={Math.max(region.accuracy ?? 25, 25)} // maneja null/undefined
                fillColor="rgba(0,122,255,0.15)"
                strokeColor="rgba(0,122,255,0.6)"
                strokeWidth={2}
              />
            )}
            
            {/* Markers de restaurantes */}
            {filtrados
              .filter(r => r.latitude != null && r.longitude != null)
              .map(r => (
                <Marker
                  key={r.id_restaurant}
                  coordinate={{
                    latitude: r.latitude as number,
                    longitude: r.longitude as number,
                  }}
                  title={r.restaurant_name}
                  description={r.description}
                  onPress={() => {
                    if (selectedMarker === r.id_restaurant) {
                      // segundo toque → abre el menú
                      setMenu_link(r.menu_link);
                      setSelectedMarker(null); // resetea después de abrir
                    } else {
                      // primer toque → solo selecciona el marker
                      setSelectedMarker(r.id_restaurant);
                    }
                  }}
                />
              ))}



          </MapView>
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center'  
          }}>
            <Text>Sorry, Your platform is currently not supported!</Text>
          </View>
        )}

        {/* OVERLAY: búsqueda + lista (lo tuyo) */}
        <View style={[styles.overlay, { top: topOffset }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.inputStyle}
              placeholderTextColor="grey"
              placeholder="Buscar restaurante..."
              value={filtro}
              onChangeText={setFiltro}
            />
            {filtro.length > 0 && (
              <Pressable style={styles.clearButton} onPress={() => setFiltro("")}>
                <Text style={styles.clearButtonText}>✕</Text>
              </Pressable>
            )}
          </View>

          {filtro.length > 0 && (
            <FlatList
              style={styles.listStyles}
              data={filtrados}
              keyExtractor={(it) => String(it.id_restaurant)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.itemStyles}
                  onPress={() => setMenu_link(item.menu_link)}
                >
                  <Image
                    source={require("../assets/images/restaurant_placeholder.png")}
                    style={styles.imageStyles}
                  />
                  <View>
                    <Text style={styles.textTitle}>{item.restaurant_name}</Text>
                    <Text>{item.description}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

        <DropDownMenu
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
        >
        </DropDownMenu>

        {/* Modal menú (lo tuyo) */}
        <Modal
          visible={menu_link !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setMenu_link(null)} // Android back button
        >
          <View style={{ flex: 1 }}>
            {/* BACKDROP that closes on tap */}
            <Pressable
              onPress={() => setMenu_link(null)}
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
            />

            {/* LAYER ABOVE THE BACKDROP */}
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              pointerEvents="box-none" // don't block backdrop where there's no card
            >
              {/* CARD — do NOT use Pressable here */}
              <View
                style={{
                  width: "95%",
                  height: "85%",
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: "white",
                }}
              >
                {Platform.OS === "web" ? (
                  menu_link && (
                    <iframe
                      src={menu_link}
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  )
                ) : (
                  menu_link && (
                    <WebView
                      source={{ uri: menu_link }}
                      style={{ flex: 1 }}
                    />
                  )
                )}
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    paddingHorizontal: 15,
    alignItems: "center",
  },

  searchContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },

  inputStyle: {
    height: 48,
    width: "100%",
    backgroundColor: "#0D3973", // azul profundo
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 44,
    fontSize: 18,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: "#188FD9",
    color: "#FFFFFF",
  },

  locationButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1EA4D9", // celeste brillante
    padding: 14,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  clearButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -16 }],
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  clearButtonText: {
    fontSize: 18,
    color: "#1EA4D9", // acento celeste
    fontWeight: "bold",
  },

  listStyles: {
    width: "100%",
    marginTop: 8,
  },

  itemStyles: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#116EBF", // azul intermedio
    borderRadius: 12,
    width: "100%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  imageStyles: {
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1EA4D9", // borde celeste
  },

  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 3,
  },

});