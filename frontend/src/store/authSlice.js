import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

// Register
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.post(
                "/auth/register",
                userData
            );

            return data.user;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );

        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {

            const { data } = await axiosClient.post(
                "/auth/login",
                credentials
            );

            return data.user;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );

        }
    }
);

// Check Authentication
export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {
        try {

            const { data } = await axiosClient.get("/auth/check");

            return data.user;

        } catch (error) {

            return rejectWithValue(null);

        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {

            await axiosClient.post("/auth/logout");

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );

        }
    }
);

// Delete Profile
export const deleteProfile = createAsyncThunk(
    "auth/deleteProfile",
    async (_, { rejectWithValue }) => {
        try {

            await axiosClient.delete("/auth/deleteProfile");

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message || "Delete failed"
            );

        }
    }
);

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })

            // Delete Profile
            .addCase(deleteProfile.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });

    },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;