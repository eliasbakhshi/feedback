import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definiera typ för användardata från API
interface UserResponse {
  UserId: string;
  Role: string;
}

// Definiera typ för auth-state
interface AuthState {
  userId: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  userId: localStorage.getItem("userId") || null,
  role: localStorage.getItem("role") || null,
  loading: false,
  error: null,
};

// Skapa slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponse>) => {
      state.userId = action.payload.UserId;
      state.role = action.payload.Role;
      localStorage.setItem("userId", action.payload.UserId);
      localStorage.setItem("role", action.payload.Role);
    },
    logout: (state) => {
      state.userId = null;
      state.role = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
