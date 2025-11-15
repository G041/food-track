import { useState } from "react";
import { Image, Keyboard, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

import { Marker } from "react-native-maps";

import { type Category } from "@/constants/categories";

import Filter from "@/components/Filter";
import MapViewer from "@/components/MapViewer";
import SearchBar from "@/components/SearchBar";
import WebViewOverlay from "@/components/WebViewOverlay";
import { Restaurant } from "@/constants/restaurant";
import { useFetchRestaurants } from "@/hooks/useFetchRestaurants";
import { useUserRegion } from "@/hooks/useUserRegion";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Map() {

  const [selectedCat, setSelectedCat] = useState<Category>("Todos"); // Category igual a: "Todos" | "Merienda" | "Bodegon" | ...

  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [currentFiltered, setCurrentFiltered] = useState<Restaurant[]>([]);

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

  const restaurantFilter = (restaurantList: Restaurant[], searchedRestaurant: String) => {
    return restaurantList.filter((r) =>
      r.restaurant_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searchedRestaurant.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )
    )
    .filter((r) => isCategoryMatch(r.description));
  }

  const restaurantMarkerGenerator = () => {
    return (
      <>
        {currentFiltered
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

  const extractRestaurantKeyFromItem = (item: Restaurant) => {
    return (String(item.id_restaurant))
  }

  const restaurantItemRenderiser = (item: Restaurant) => {
    return (
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

        {/* Search bar */}
        <SearchBar
          itemList={restaurants}
          itemFilter={restaurantFilter}
          topOffset={topOffset}
          extractKeyFromItem={extractRestaurantKeyFromItem}
          itemRenderiser={restaurantItemRenderiser}
          onFilteredItemsChange={setCurrentFiltered}
        />
        
        {/* Boton de filtros */}
        <Filter
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