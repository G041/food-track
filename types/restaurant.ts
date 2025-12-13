import { Category } from "./categories";

type Restaurant = {
  id_restaurant: number;
  restaurant_name: string;
  description?: Category | string;
  menu_link: string;
  latitude: number;   
  longitude: number;
};

export type { Restaurant };
