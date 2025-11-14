import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Region } from "react-native-maps";


export function useUserRegion() {
    
    // Región con accuracy opcional (para el círculo)
    type RegionWithAccuracy = Region & { accuracy?: number | null }; 

    // --- NUEVO: región del usuario ---
    const [region, setRegion] = useState<RegionWithAccuracy | null>(null);

    // 1) pedir ubicación y setear initialRegion
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
                accuracy: loc.coords.accuracy, // ahora coincide con el tipo
            });
        })();
    }, []);

    return {
        region
    };
}
