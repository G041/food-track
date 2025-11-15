export const CATEGORIES = [
  "Todos",
  "Merienda",
  "Bodegon",
  "Restaurante",
  "Bar",
  "Comida Rapida",
] as const;

export type Category = typeof CATEGORIES[number];