import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import restaurantsReducer from './restaurantsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantsReducer,
  },
});

// typings
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
