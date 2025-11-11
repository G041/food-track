import { Ionicons } from "@expo/vector-icons"; //para el boton que centra la ubicacion
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Keyboard, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { WebView } from "react-native-webview";

import * as Location from "expo-location";
import type { Region } from "react-native-maps";
import MapView, { Circle, Marker } from "react-native-maps";

import { API_URL } from "./config";

type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description: string;
  menu_link: string;
  latitude: number | null;   // por si vienen nulos en la primera migración
  longitude: number | null;
};

// Región con accuracy opcional (para el círculo)
type RegionWithAccuracy = Region & { accuracy?: number };

export default function Map() {
  // --- estado existente tuyo (filtro, modal, restaurantes, etc.) ---
  const [filtro, setFiltro] = useState("");
  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<MapView>(null);

  // --- NUEVO: región del usuario ---
  const [region, setRegion] = useState<RegionWithAccuracy | null>(null);

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
        accuracy: loc.coords.accuracy,
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
  const filtrados = restaurants.filter((r) =>
    r.restaurant_name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )
  );

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
        <MapView
          style={styles.map}
          initialRegion={region}
          ref = {mapRef}
          showsUserLocation
          showsPointsOfInterest={false}
          mapType="mutedStandard"
        >
          <Pressable onPress={centerOnUser} style={styles.locationButton}>
            <Ionicons name="locate" size={28} color="black" />
          </Pressable>
          {/* Círculo de precisión opcional */}
          {region.accuracy !== undefined && (
            <Circle
              center={{ latitude: region.latitude, longitude: region.longitude }}
              radius={Math.max(region.accuracy, 25)}
              fillColor="rgba(0,122,255,0.15)"
              strokeColor="rgba(0,122,255,0.6)"
              strokeWidth={2}
            />
          )}

          {/* Markers de restaurantes (fork & knife si ya los pusiste) */}
          {restaurants
            .filter(r => r.latitude != null && r.longitude != null) // <-- evita null
            .map(r => (
              <Marker
                key={r.id_restaurant}
                coordinate={{
                  latitude: r.latitude as number,
                  longitude: r.longitude as number,
                }}
                title={r.restaurant_name}
                description={r.description}
                onPress={() => setMenu_link(r.menu_link)}
              />
            ))
          }

        </MapView>

        {/* OVERLAY: búsqueda + lista (lo tuyo) */}
        <View style={styles.overlay}>
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

        {/* Modal menú (lo tuyo) */}
        <Modal visible={menu_link !== null} transparent animationType="fade">
          <Pressable
            onPress={() => setMenu_link(null)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pressable style={{ width: "90%", height: "80%", borderRadius: 10, overflow: "hidden" }}>
              {Platform.OS === "web" ? (
                menu_link && (
                  <iframe
                    src={menu_link}
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                )
              ) : (
                menu_link && <WebView source={{ uri: menu_link }} style={{ flex: 1 }} />
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },

  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  inputStyle: {
    color: "black",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 36, // espacio para la X
    fontSize: 18,
    width: "100%",
  },
   locationButton: {  //boton para el mapa
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clearButton: { position: "absolute", right: 20, padding: 6 },
  clearButtonText: { fontSize: 18, color: "black" },

  listStyles: { width: "100%", marginTop: 8 },
  itemStyles: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 10,
    width: "100%",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageStyles: { width: 70, height: 70, marginRight: 10, borderRadius: 8 },
  textTitle: { fontSize: 18, fontWeight: "bold" },
});
