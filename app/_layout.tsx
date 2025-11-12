import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C0526", // fondo oscuro profundo
          borderTopColor: "#0D3973", // borde superior azul oscuro
          height: Platform.OS === "ios" ? 80 : 70,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,
          paddingTop: 10,
          shadowColor: "#116EBF",
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        },
        tabBarActiveTintColor: "#1EA4D9", // activo: azul brillante
        tabBarInactiveTintColor: "#188FD9", // inactivo: celeste medio
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Escanear QR",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="qrcode" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/* 
<Stack>
  <Stack.Screen name="index" />
</Stack>
*/
