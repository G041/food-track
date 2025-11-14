import { Category } from "@/constants/categories";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { API_URL } from "../utils/config";

type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description?: Category | string;
  menu_link: string;
  latitude: number;   
  longitude: number;
};

export function useFetchRestaurants() {
    
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useFocusEffect(
        useCallback(() => {
        async function fetchRestaurants() {
            try {
            const res = await fetch(`${API_URL}/restaurants`);
            const data = await res.json();
            setRestaurants(data);
            } catch (err) {
            console.error("Error fetching restaurants:", err);
            }
        }
        fetchRestaurants();
        }, [])
    );

    return {
        restaurants
    }
};