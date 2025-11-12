import { AppDispatch, RootState, store } from "@/store"; // adjust path if needed
import { loadTokenFromStorage } from "@/store/authSlice"; // thunk
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";


function AppTabs() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn);
  const isLoading = useSelector((s: RootState) => s.auth.isLoading);

  // bootstrap once: load token from secure storage into redux
  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  // while loading, you can return null or a spinner; we'll render Tabs anyway
  // but you could also show a splash/loading screen
  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C0526", // fondo oscuro profundo
          borderTopColor: "#0D3973", // borde superior azul oscuro
          shadowColor: "#116EBF",
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 5,
          paddingTop: 5,
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
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Scan a QR",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="qrcode" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppTabs/>
    </Provider>
  );
}

