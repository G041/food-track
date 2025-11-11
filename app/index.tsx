import { useCallback, useState } from "react";
import { FlatList, Image, Keyboard, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { WebView } from "react-native-webview";

import { useFocusEffect } from "expo-router";
//import Mapa from "./mapa"; // <--- IMPORTANTE: ruta correcta
import MapView, { Marker /*, Callout, PROVIDER_DEFAULT */ } from "react-native-maps";


import { API_URL } from './config';


type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description: string;
  menu_link: string;
  latitude: number;
  longitude: number;
};


/*
export function Index() {
  return (
    <View style={styles.container}>
      <Mapa />
    </View>
  );
}
*/
export function Mapa() {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: -34.6037,     // ejemplo: Buenos Aires
        longitude: -58.3816,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    />
  );
}

export default function Map() {
  const [filtro, setFiltro] = useState("");
  const [menu_link, setMenu_link] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  // const [resizeMode, setResizeMode] = useState<"cover" | "contain" | "stretch">("cover");
  // const [favoritos, setFavoritos] = useState<string[]>([]);

 useFocusEffect(
  useCallback(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch(`${API_URL}/restaurants`);
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    }

    fetchRestaurants();
  }, [])
);


  // restaurantes filtrados por título
  const filtrados = restaurants.filter(r =>
    r.restaurant_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  // function toggleFavorito(id: string) {
  //   setFavoritos(prev =>
  //     prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  //   );
  // }

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      
      {/* Mapa de fondo */}
  <MapView
  style={styles.map}
  initialRegion={{
    latitude: -34.4718,
    longitude: -58.5162,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
>
  {restaurants
  .filter(r => typeof r.latitude === "number" && typeof r.longitude === "number")
  .map((r) => (
    <Marker
      key={r.id_restaurant}
      coordinate={{ latitude: r.latitude as number, longitude: r.longitude as number }}
      title={r.restaurant_name}
      description={r.description}
      onPress={() => setMenu_link(r.menu_link)}
    />
))}

</MapView>


      {/* Contenido superpuesto arriba del mapa */}
      <View style={styles.overlay}>

  {/* Barra de búsqueda con X */}
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

  {/* Lista filtrada */}
  {filtro.length > 0 && (
    <FlatList
      style={styles.listStyles}
      data={filtrados}
      renderItem={({ item }) => (
        <Pressable
          style={styles.itemStyles}
          onPress={() => setMenu_link(item.menu_link)}
        >
          <Image source={require("../assets/images/restaurant_placeholder.png")} style={styles.imageStyles} />
          <View>
            <Text style={styles.textStyle}>{item.restaurant_name}</Text>
            <Text>{item.description}</Text>
          </View>
        </Pressable>
      )}
    />
  )}

</View>


      {/* Modal Menú */}
      <Modal visible={menu_link !== null} transparent animationType="fade">
        <Pressable
          onPress={() => setMenu_link(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable style={{ width: "90%", height: "80%", borderRadius: 10, overflow: "hidden" }} onPress={() => {}}>
            {Platform.OS === "web" ? (
              <>
                {menu_link && (
                  <iframe
                    src={menu_link}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {menu_link && (
                  <WebView source={{ uri: menu_link }} style={{ flex: 1 }} />
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  </TouchableWithoutFeedback>
);

};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
  },

  container: {  //para el mapa
    flex: 1,
  },
  map: {
    flex: 1,  //para el mapa
  },
  overlay: {
  position: "absolute",
  top: 0,                   // 👈 ANTES estaba 50 / 25
  width: "100%",
  alignItems: "center",
  paddingHorizontal: 15,
  paddingTop: 8,            // pequeño espacio visual opcional
},


searchContainer: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,
},

clearButton: {
  position: "absolute",
  right: 20,
  padding: 6,
},

clearButtonText: {
  fontSize: 18,
  color: "black",
},


  textStyle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10
  },

  buttonTextStyle: {
    color: "white",
    fontSize: 20,
  },

  inputStyle: {
  color: "black",
  backgroundColor: "white",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 8,
  fontSize: 18,
  width: "100%",
  borderWidth: 0,
  elevation: 3, // sombra Android
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 }, // sombra iOS
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
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
    width: "100%",        // <-- hace que coincida exactamente con barra
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
},


  imageStyles: {
  width: 70,
  height: 70,
  marginRight: 10,
  borderRadius: 8,
},


  favoritoStyles: { backgroundColor: "#ffe680" },

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
  },

  listStyles: {
    width: "100%",       // antes era 85%, ahora será igual al Search
    marginTop: 8,
},

  backgroundStyles: {
    flex: 1, 
  },
});