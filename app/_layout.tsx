import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
    }}>
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
        title: "Escanear un QR", 
        tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="qrcode" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
      name="home" 
      options={{ 
        title: "Home", 
        tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/*<Stack>
        <Stack.Screen name="index"/>
      </Stack>
*/