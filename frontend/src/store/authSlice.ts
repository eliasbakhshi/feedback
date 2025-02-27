import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define user data type from API
interface UserResponse {
  UserId: string;
  Role: string;
}

// Define auth state
interface AuthState {
  userId: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state (DO NOT USE LocalStorage for security reasons)
const initialState: AuthState = {
  userId: null,
  role: null,
  loading: false,
  error: null,
};

// 🔹 Fetch user session from API
export const fetchUserSession = createAsyncThunk(
  "auth/fetchUserSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/login/user-info", {
        credentials: "include", // 🔥 Important! Ensures cookies are sent
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      return (await response.json()) as UserResponse;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSession.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.userId = action.payload.UserId;
        state.role = action.payload.Role;
        state.loading = false;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// 🔹 Selector to get auth state
export const selectAuth = (state: RootState) => state.auth;
