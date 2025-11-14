import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

export function useCameraScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView | null>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const [scanned, setScanned] = useState(false);
    const [scannedURL, setScannedURL] = useState("");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const toggleFacing = useCallback(() => {
        setFacing((p) => (p === "back" ? "front" : "back"));
    }, []);

    const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);
        console.log(`Scanned ${type}: ${data}`);
        setScannedURL(data);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso denegado", "Se guardará sin coordenadas.");
            setCoords(null);
            return;
        }
        const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    };

    return {
        permission,
        requestPermission,
        ref,
        facing,
        scanned,
        setScanned,
        toggleFacing,
        handleBarcodeScanned,
        scannedURL,
        coords
    };
}
