import { mapStyleNoPOI } from "@/constants/mapStyleNoPOI";
import { RegionWithAccuracy } from "@/types/region";
import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Circle, Point, PROVIDER_GOOGLE } from "react-native-maps";

type Props = {
    region: RegionWithAccuracy | null,
    renderMarkers?: () => React.JSX.Element,
    compassPosition?: Point | undefined,
    onMapLongPress?: (coords: { latitude: number; longitude: number }) => void;
}

export default function MapViewer({ region, renderMarkers, compassPosition, onMapLongPress }: Props) {

    const mapRef = useRef<MapView>(null);

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
        <View style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                ref={mapRef}
                showsUserLocation
                customMapStyle={mapStyleNoPOI}
                mapType="standard"
                showsCompass={false}
                showsMyLocationButton={false}
                toolbarEnabled={false}
                onLongPress={onMapLongPress? ((e) => onMapLongPress(e.nativeEvent.coordinate)) : undefined}
            >

                {/* Círculo de precisión opcional */}
                {region.accuracy !== undefined && (
                    <Circle
                        center={{ latitude: region.latitude, longitude: region.longitude }}
                        radius={Math.max(region.accuracy ?? 25, 25)} // maneja null/undefined
                        fillColor="rgba(0,122,255,0.15)"
                        strokeColor="rgba(0,122,255,0.6)"
                        strokeWidth={2}
                    />
                )}

                {/* Markers */}
                {renderMarkers?.()}

            </MapView>

            <Pressable onPress={centerOnUser} style={styles.locationButton}>
                <Ionicons name="locate" size={28} color="black" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  locationButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1EA4D9", // celeste brillante
    padding: 14,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

});