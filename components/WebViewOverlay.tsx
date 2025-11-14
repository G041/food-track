import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

type Props = {
    url: string | null,
    setURL: React.Dispatch<React.SetStateAction<string | null>>
}

export default function WebViewOverlay({ url, setURL }: Props) {

    return (
        <Modal
            visible={url !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setURL(null)} // Android back button
        >
            <View style={{ flex: 1 }}>
                {/* BACKDROP that closes on tap */}
                <Pressable
                    onPress={() => setURL(null)}
                    style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                />

                {/* LAYER ABOVE THE BACKDROP */}
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    pointerEvents="box-none" // don't block backdrop where there's no card
                >
                    {/* CARD — do NOT use Pressable here */}
                    <View
                    style={{
                        width: "95%",
                        height: "85%",
                        borderRadius: 10,
                        overflow: "hidden",
                        backgroundColor: "white",
                    }}
                    >
                    {Platform.OS === "web" ? (
                        url && (
                        <iframe src={url} style={{ width: "100%", height: "100%", border: "none" }}/>
                        )
                    ) : (
                        url && (
                        <WebView source={{ uri: url }} style={{ flex: 1 }}/>
                        )
                    )}
                    </View>
                </View>
            </View>
        </Modal>
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