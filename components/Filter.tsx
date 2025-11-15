import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CATEGORIES, type Category } from "@/constants/categories";

type Props = {
  setSelectedCat: React.Dispatch<React.SetStateAction<Category>>,
  selectedCat: Category,
};

export default function Filter({ setSelectedCat, selectedCat } : Props) {
    
    const [categoryOpen, setCategoryOpen] = useState(false);     // si el menú está abierto

    return (
        <View style={styles.filterAnchor}>
            <Pressable onPress={() => setCategoryOpen((v) => !v)} style={styles.filterButton}>
                <Ionicons name="funnel" size={20} color="#0D3973" />
                <Text style={styles.filterButtonText}>
                    {selectedCat === "Todos" ? "Categoría" : selectedCat}
                </Text>
            </Pressable>

            {/* Backdrop para cerrar el dropdown tocando fuera */}
            {categoryOpen && (
                <Pressable
                    onPress={() => setCategoryOpen(false)}
                    style={StyleSheet.absoluteFillObject}
                />
            )}

            {/* Menú desplegable */}
            {categoryOpen && (
                <View style={styles.dropdownCard}>
                    {CATEGORIES.map((cat) => (
                        <Pressable
                            key={cat}
                            onPress={() => {
                                setSelectedCat(cat);
                                setCategoryOpen(false);
                            }}
                            style={({ pressed }) => [
                                styles.dropdownItem,
                                pressed && { opacity: 0.7 },
                            ]}
                        >
                            <Text style={[ styles.dropdownText, cat === selectedCat && styles.dropdownTextActive ]}>
                                {cat}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    filterAnchor: {
        position: "absolute",
        left: 20,     // misma distancia que el botón de centrado (right: 20)
        bottom: 30,   // misma altura que el botón de centrado (bottom: 30)
        zIndex: 20,
    },

    filterButton: {
        padding: 18,
        borderRadius: 35,          // circular
        backgroundColor: "#1EA4D9", // mismo celeste que tu botón de ubicación
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    filterButtonText: {
        display: "none", // ya no mostramos texto dentro del círculo
    },
    
    dropdownCard: {
        position: "absolute",
        bottom: 60,           // aparece justo arriba del botón (ajustá según te guste)
        left: 0,              // alineado a la izquierda del botón
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#188FD9",
        paddingVertical: 6,
        width: 180,
        flexDirection: "column",      // asegura disposición vertical
        alignItems: "flex-start",     // alinea el contenido a la izquierda
        justifyContent: "flex-start", // alinea los elementos hacia arriba
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
        zIndex: 30,
    },


    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "100%",               // que ocupen todo el ancho del menú
        alignItems: "flex-start",    // texto alineado a la izquierda
    },

    dropdownText: {
        color: "#0D3973",
        fontSize: 16,
        textAlign: "left",           // texto alineado a la izquierda
    },


    dropdownTextActive: {
        fontWeight: "700",
        color: "#116EBF",
    },

})