import { Region } from "react-native-maps";

type RegionWithAccuracy = Region & { 
    accuracy?: number | null 
};

export type { RegionWithAccuracy };

