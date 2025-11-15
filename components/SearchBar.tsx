
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props<T> = {
    itemList: T[],
    itemFilter: (restaurantList: T[], searchedRestaurant: String) => T[],
    topOffset?: number,
    extractKeyFromItem: (item: T) => string,
    itemRenderiser: (item: T) => React.JSX.Element,
    onFilteredItemsChange:  React.Dispatch<React.SetStateAction<T[]>>,
}

export default function SearchBar<T> ({ itemList, itemFilter, topOffset, extractKeyFromItem, itemRenderiser, onFilteredItemsChange }: Props<T>) {

    const [filtro, setFiltro] = useState("");

    const filtrados = itemFilter(itemList, filtro);

    // Notify parent whenever filtrados changes
    useEffect(() => {
        onFilteredItemsChange?.(filtrados);
    }, [filtrados, onFilteredItemsChange]);

    return (
        <View style={[styles.overlay, { top: topOffset }]}>
            {/* OVERLAY: búsqueda + lista (lo tuyo) */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.inputStyle}
                    placeholderTextColor="#ffffff83"
                    placeholder="Buscar restaurante..."
                    value={filtro}
                    onChangeText={setFiltro}
                />
                {filtro.length > 0 && (
                    <Pressable style={styles.clearButton} onPress={() => setFiltro("")}>
                    <Text style={styles.clearButtonText}>✕</Text>
                    </Pressable>
                )}
            </View>

            {filtro.length > 0 && (
            <FlatList
                style={styles.listStyles}
                data={filtrados}
                keyExtractor={(it) => extractKeyFromItem(it)}
                renderItem={({ item }) => itemRenderiser(item) }
            />
            )}
        </View>
    )
}

const styles = StyleSheet.create({

    overlay: {
        position: "absolute",
        left: 0,
        right: 0,
        width: "100%",
        paddingHorizontal: 15,
        alignItems: "center",
    },

    searchContainer: {
        width: "100%",
        position: "relative",
        justifyContent: "center",
    },

    inputStyle: {
        height: 48,
        width: "100%",
        backgroundColor: "#2daefe12", // azul profundo
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 44,
        fontSize: 18,
        marginBottom: 8,
        borderWidth: 0,
        borderColor: "#0d2a51ff",
        color: "#FFFFFF",
    },

    clearButton: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -16 }],
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },

    clearButtonText: {
        fontSize: 18,
        color: "#1EA4D9", // acento celeste
        fontWeight: "bold",
    },

    listStyles: {
        width: "100%",
        marginTop: 8,
    },

})