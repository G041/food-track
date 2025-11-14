import { useState } from "react";
import { FlatList, Image, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { Marker } from "react-native-maps";

import { type Category } from "@/constants/categories";

import DropDownMenu from "@/components/DropDownMenu";
import MapViewer from "@/components/MapViewer";
import WebViewOverlay from "@/components/WebViewOverlay";
import { useFetchRestaurants } from "@/hooks/useFetchRestaurants";
import { useUserRegion } from "@/hooks/useUserRegion";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Map() {

  const [selectedCat, setSelectedCat] = useState<Category>("Todos"); // Category igual a: "Todos" | "Merienda" | "Bodegon" | ...

  // --- estado existente tuyo (filtro, modal, restaurantes, etc.) ---
  const [filtro, setFiltro] = useState("");
  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const insets = useSafeAreaInsets();
  
  // topOffset ensures the overlay sits below the notch/status bar
  const topOffset = insets.top + 10; // tweak +10 or +12 for spacing

  // establezco localizacion de usuario
  const { region } = useUserRegion();
  // fetch de restaurantes 
  const { restaurants } = useFetchRestaurants();

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

  const restaurantMarkerGenerator = () => {
    return (
      <>
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
                />)
            )
        }
      </>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        {/* MAPA */}
        {Platform.OS === "ios" ? (
          <MapViewer
            region={region}
            compassPosition={{ x: -10, y: insets.top + 20 }}
            renderMarkers={restaurantMarkerGenerator}
          />
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
              placeholderTextColor="#ffffff83"
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
        
        {/* Boton de filtros */}
        <DropDownMenu
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
        />

        {/* Display de menu */}
        <WebViewOverlay
          url={menu_link}
          setURL={setMenu_link}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

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
    backgroundColor: "#2daefe12", // azul profundo
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 44,
    fontSize: 18,
    marginBottom: 8,
    borderWidth: 0,
    borderColor: "#0d2a51ff",
    color: "#FFFFFF",
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