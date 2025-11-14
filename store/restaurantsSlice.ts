import { API_URL } from "@/utils/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./authSlice";

export interface RestaurantInt {
  id_restaurant?: string; // if returned by backend
  restaurant_name: string;
  description: string;
  menu_link: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

export interface RestaurantsState {
  list: RestaurantInt[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RestaurantsState = {
  list: [],
  isLoading: false,
  error: null,
};

// Thunk for adding a restaurant
export const addRestaurantThunk = createAsyncThunk<
        RestaurantInt, // return type
        RestaurantInt, // argument type
        { rejectValue: string, state: { auth: AuthState } }
    >("restaurants/addRestaurant", async (newRestaurant, { rejectWithValue, getState }) => {
        try {
          // sacamos el token del state de auth
          const token = getState().auth.token;

          if (!token) return rejectWithValue("No token available");

          const response = await fetch(`${API_URL}/restaurants`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newRestaurant),
          });

          const data = await response.json();
          if (!response.ok) return rejectWithValue(data.error || "Failed to add restaurant");

          return data; // the newly created restaurant
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    });

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRestaurantThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRestaurantThunk.fulfilled, (state, action: PayloadAction<RestaurantInt>) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addRestaurantThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add restaurant";
      });
  },
});

export default restaurantsSlice.reducer;
