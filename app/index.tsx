import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { Region } from "react-native-maps";
import MapView, { Circle, Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { API_URL } from "../utils/config";

type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description: string;
  menu_link: string;
  latitude: number;
  longitude: number;
};

type RegionWithAccuracy = Region & { accuracy?: number | null };

export default function Map() {
  const [filtro, setFiltro] = useState("");
  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<RegionWithAccuracy | null>(null);

  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 10;

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
      500
    );
  };

  if (!region) return <View style={{ flex: 1, backgroundColor: "#400101" }} />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {Platform.OS === "ios" ? (
          <MapView
            style={styles.map}
            initialRegion={region}
            ref={mapRef}
            showsUserLocation
            showsPointsOfInterest={false}
            mapType="mutedStandard"
            compassOffset={{ x: -10, y: insets.top + 20 }}
          >
            <Pressable onPress={centerOnUser} style={styles.locationButton}>
              <Ionicons name="locate" size={28} color="#400101" />
            </Pressable>

            {region.accuracy !== undefined && (
              <Circle
                center={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                radius={Math.max(region.accuracy ?? 25, 25)}
                fillColor="rgba(217,96,26,0.15)"
                strokeColor="#D9601A"
                strokeWidth={2}
              />
            )}

            {restaurants
              .filter((r) => r.latitude != null && r.longitude != null)
              .map((r) => (
                <Marker
                  key={r.id_restaurant}
                  coordinate={{
                    latitude: r.latitude as number,
                    longitude: r.longitude as number,
                  }}
                  title={r.restaurant_name}
                  description={r.description}
                  pinColor="#F28E13"
                  onPress={() => setMenu_link(r.menu_link)}
                />
              ))}
          </MapView>
        ) : (
          <View style={styles.unsupported}>
            <Text style={{ color: "#F28E13" }}>
              Plataforma no soportada actualmente
            </Text>
          </View>
        )}

        <View style={[styles.overlay, { top: topOffset }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.inputStyle}
              placeholderTextColor="#F2A413"
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
                    <Text style={styles.textDescription}>{item.description}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

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
  container: {
    flex: 1,
    backgroundColor: "#400101",
  },
  map: { flex: 1 },
  unsupported: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#730202",
    color: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F28E13",
    paddingLeft: 12,
    paddingRight: 44,
    fontSize: 18,
    marginBottom: 8,
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
    color: "#F2A413",
  },
  locationButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#F2A413",
    padding: 12,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listStyles: { width: "100%", marginTop: 8 },
  itemStyles: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#D9601A",
    borderRadius: 10,
    width: "100%",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageStyles: { width: 70, height: 70, marginRight: 10, borderRadius: 8 },
  textTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  textDescription: {
    color: "#FFF",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalInner: {
    width: "95%",
    height: "85%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#F2A413",
    backgroundColor: "#400101",
  },
});
