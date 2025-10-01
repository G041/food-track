import { ImageStyle } from "expo-image";
import { useState } from "react";
import {
  FlatList, Image, Modal, Pressable, Text, TextInput, TextStyle, View, ViewStyle
} from "react-native";

type Producto = {
  id: string;
  titulo: string;
  precio: string;
  descripcion: string;
  imagen: any;
};

const productos: Producto[] = [
  // {
  //   id: "1",
  //   titulo: "iPhone 12",
  //   precio: "$800",
  //   descripcion: "aifon dose.",
  //   imagen: require("../assets/images/aifon.png"),
  // },
  {
    id: "2",
    titulo: "Baldosa",
    precio: "$1000000",
    descripcion: "1 (una) baldosa de cemento alisado.",
    imagen: { uri: "https://bara.com.ar/wp-content/uploads/2021/08/baldosa-cemento-alisado-render@2x.png"},
  },  
  {
    id: "3",
    titulo: "Nike Air Force One",
    precio: "$120",
    descripcion: "Shantas Naik.",
    imagen: { uri: "https://www.mrkicks.fr/cdn/shop/products/nike-air-force-1-low-white-orange-mr-kicks-1.png?v=1691178453&width=1500" },
  },
  {
    id: "4",
    titulo: "Bujia MR7C-9N",
    precio: "$54",
    descripcion: "bujia.",
    imagen: { uri: "https://mundimotos.com/cdn/shop/products/H31916-KSP-861_600x.png?v=1754721361" },
  },
];

export default function Map() {
  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  }

  const textStyle : TextStyle = {
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 10
  }

  const buttonTextStyle : TextStyle = {
    color: "white",
    fontSize: 20,
  }

  const inputStyle : TextStyle = {
    color: "black",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "85%",
    height: "10%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
  }

  const buttonStyles : ViewStyle = {
    backgroundColor: "rebeccapurple",
    width: "80%",
    height: "8%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  }

  const cancelButtonStyles : ViewStyle = {
    backgroundColor: "darkred",
    width: "80%",
    height: "8%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  }

  const itemStyles : ViewStyle = {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  }

  const imageStyles : ImageStyle = {
    width: 150, 
    height: 150, 
    marginRight: 10
  }

  const favoritoStyles : ViewStyle = { backgroundColor: "#ffe680" };

  const modalBackgroundStyles : ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  }

  const textBackgroundStyle : ViewStyle = {
    alignItems: "center",
    width: 200,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderBlockColor: "black",
    borderWidth: 2
  }

  const listStyles : ViewStyle = {
    width: "85%",
  }

  const [filtro, setFiltro] = useState("");
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [resizeMode, setResizeMode] = useState<"cover" | "contain" | "stretch">("cover");
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // productos filtrados por título
  const filtrados = productos.filter(p =>
    p.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  function toggleFavorito(id: string) {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  return (
    <View style={containerStyles}>
      <TextInput
        style={inputStyle}
        placeholderTextColor="gray"
        placeholder="Buscar producto..."
        value={filtro}
        onChangeText={setFiltro}
      />

      <FlatList
        style={listStyles}
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const esFavorito = favoritos.includes(item.id);
          return (
            <Pressable
              style={[itemStyles, esFavorito && favoritoStyles]}
              onPress={() => setSeleccionado(item)}
              onLongPress={() => toggleFavorito(item.id)}
            >
              <Image source={item.imagen} style={imageStyles} resizeMode="contain" />
              <View>
                <Text style={textStyle}>{item.titulo}</Text>
                <Text>{item.precio}</Text>
              </View>
            </Pressable>
          );
        }}
      />
      <Modal visible={seleccionado !== null} transparent={true}>
        <View style={modalBackgroundStyles}>
          <View style={containerStyles}>
            {seleccionado ?
              <>
                <Image
                  source={seleccionado.imagen}
                  style={imageStyles}
                  resizeMode={resizeMode}
                />

                <View style={textBackgroundStyle}>
                  <Text style={textStyle}>{seleccionado.titulo}</Text>
                  <Text>{seleccionado.descripcion}</Text>
                </View>

                <Pressable style={buttonStyles} onPress={() => setResizeMode("cover")}>
                  <Text style={buttonTextStyle}>Cover</Text>
                </Pressable>
                <Pressable style={buttonStyles} onPress={() => setResizeMode("contain")}>
                  <Text style={buttonTextStyle}>Contain</Text>
                </Pressable>
                <Pressable style={buttonStyles}onPress={() => setResizeMode("stretch")}>
                  <Text style={buttonTextStyle}>Stretch</Text>
                </Pressable>

                <Pressable style={cancelButtonStyles} onPress={() => setSeleccionado(null)}>
                  <Text style={buttonTextStyle}>Cerrar</Text>
                </Pressable>
              </>
              : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}