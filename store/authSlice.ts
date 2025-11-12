// store/authSlice.ts
import {
  clearCredentials,
  getToken,
  getUserID,
  getUsername,
  saveToken,
  saveUserID,
  saveUsername,
} from '@/utils/authStorage';
import { API_URL } from '@/utils/config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  user_id: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
  token: null,
  username: null,
  user_id: null,
  error: null,
};

// Thunk: load token from SecureStore on startup
export const loadTokenFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async () => {
    const token = await getToken();
    const username = await getUsername();
    const user_id = await getUserID();
    return { token, username, user_id };
  }
);

// Thunk: login (fetch backend and persist token + user info)
export const loginThunk = createAsyncThunk<
    // fulfilled payload type
    { token: string; username: string | null; user_id: string | null },
    // arg type
    { identifier: string; password: string },
    // thunkAPI reject type
    { rejectValue: string }
  >(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) {
          // normalize backend error to a string
          return rejectWithValue(data?.error ?? 'Login failed');
        }

        // pick username and user_id from possible shapes safely
        const username = data?.user?.username ?? data?.username ?? null;

        const user_id =
          data?.user?.user_id != null
            ? String(data.user.user_id)
            : data?.user_id != null
            ? String(data.user_id)
            : null;

        // Persist securely
        if (data?.accessToken) {
          await saveToken(data.accessToken);
        }
        if (username) await saveUsername(username);
        if (user_id) await saveUserID(user_id);

        return {
          token: data.accessToken,
          username,
          user_id,
        };
      } catch (err: any) {
        return rejectWithValue(err?.message ?? 'Network error');
      }
    }
  );

export const signupThunk = createAsyncThunk<
    // fulfilled payload type
    { token: string; username: string | null; user_id: string | null },
    // arg type
    { emailAddress: string; username: string; password: string },
    // thunkAPI reject type
    { rejectValue: string }
  >(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) {
          // normalize backend error to a string
          return rejectWithValue(data?.error ?? 'Login failed');
        }

        // pick username and user_id from possible shapes safely
        const username =
          data?.user?.username ?? data?.username ?? null;

        const user_id =
          data?.user?.user_id != null
            ? String(data.user.user_id)
            : data?.user_id != null
            ? String(data.user_id)
            : null;

        // Persist securely
        if (data?.accessToken) {
          await saveToken(data.accessToken);
        }
        if (username) await saveUsername(username);
        if (user_id) await saveUserID(user_id);

        return {
          token: data.accessToken,
          username,
          user_id,
        };
      } catch (err: any) {
        return rejectWithValue(err?.message ?? 'Network error');
      }
    }
  );

// Thunk: logout
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await clearCredentials();
  return;
});



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional: manually set token / username / user_id in the store
    setToken(
      state,
      action: PayloadAction<{ token: string | null; username?: string | null; user_id?: string | null }>
    ) {
      state.token = action.payload.token;
      state.username = action.payload.username ?? state.username;
      state.user_id = action.payload.user_id ?? state.user_id;
      state.isLoggedIn = !!action.payload.token;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTokenFromStorage.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(loadTokenFromStorage.fulfilled, (s, action) => {
        s.isLoading = false;
        s.token = action.payload.token ?? null;
        s.username = action.payload.username ?? null;
        s.user_id = action.payload.user_id ?? null;
        s.isLoggedIn = !!action.payload.token;
      })
      .addCase(loadTokenFromStorage.rejected, (s) => {
        s.isLoading = false;
      })
      .addCase(loginThunk.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, action) => {
        s.isLoading = false;
        s.token = action.payload.token;
        s.username = action.payload.username ?? s.username;
        s.user_id = action.payload.user_id ?? s.user_id;
        s.isLoggedIn = !!action.payload.token;
      })
      .addCase(loginThunk.rejected, (s, action) => {
        s.isLoading = false;
        s.error = (action.payload as string) ?? action.error?.message ?? 'Login failed';
      })
      .addCase(logoutThunk.fulfilled, (s) => {
        s.token = null;
        s.username = null;
        s.user_id = null;
        s.isLoggedIn = false;
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
