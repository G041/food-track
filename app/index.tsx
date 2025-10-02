import { useState } from "react";
import { FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Restaurante = {
  id: number;
  titulo: string;
  precio: string;
  descripcion: string;
  imagen: any;
};

const productos: Restaurante[] = [
  {
    id: 1,
    titulo: "McDonald's",
    precio: "$",
    descripcion: "BUrgas",
    imagen: { uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/250px-McDonald%27s_logo.svg.png"},
  },  
  {
    id: 2,
    titulo: "Los Pumas Café",
    precio: "$$$$$$$$$$$$$$",
    descripcion: "AAAAAAAAAAAAAAAAAAAAAAAHHH",
    imagen: { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5iRLFcMH-8t7AKZgcofAIDbcHP9OgKXJzw&s" },
  },
  {
    id: 3,
    titulo: "Philadelphia Kirkhouse",
    precio: "$$$",
    descripcion: "Counting or not counting gang violence?",
    imagen: { uri: "https://katu.com/resources/media2/1x1/1040/1440/405x0/90/d0649613-6462-4dc2-8610-7c73e28e2459-immingration.png" },
  },
];

export default function Map() {
  const [filtro, setFiltro] = useState("");
  // const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  // const [resizeMode, setResizeMode] = useState<"cover" | "contain" | "stretch">("cover");
  // const [favoritos, setFavoritos] = useState<string[]>([]);

  // restaurantes filtrados por título
  const filtrados = productos.filter(p =>
    p.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
  );

  // function toggleFavorito(id: string) {
  //   setFavoritos(prev =>
  //     prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  //   );
  // }

  return (
    <ImageBackground
      source={{ uri: "https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg?mbid=social_retweet"}}
      style={styles.backgroundStyles}
      resizeMode="cover"
    >
      <View style={styles.containerStyles}>
        <TextInput
          style={styles.inputStyle}
          placeholderTextColor="grey"
          placeholder="Buscar restaurante..."
          value={filtro}
          onChangeText={setFiltro}
          clearButtonMode="while-editing"
        />

        {filtro.length > 0 && (
          <FlatList
            style={styles.listStyles}
            data={filtrados}
            renderItem={({ item }) => {
              return (
                <Pressable
                  style={styles.itemStyles}
                  //onPress={() => setSeleccionado(item)}
                  //onLongPress={() => toggleFavorito(item.id)}
                >
                  <Image source={item.imagen} style={styles.imageStyles} resizeMode="contain" />
                  <View>
                    <Text style={styles.textStyle}>{item.titulo}</Text>
                    <Text>{item.precio}</Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
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
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "90%",
    height: "10%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.19)",
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
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },

  imageStyles: {
    width: 100, 
    height: 100, 
    marginRight: 10
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
    width: "85%",
  },

  backgroundStyles: {
    flex: 1, 
  },
});