// agent/store/slices/agentSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Agent from '@/types/index';

interface AgentState {
    agent: Agent | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AgentState = {
    agent: null,
    accessToken: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

/* ---------------- LOGIN THUNK ---------------- */

export const loginAgent = createAsyncThunk<
    {
        agent: Agent;
        accessToken: string;
    },
    {
        email: string;
        password: string;
    },
    {
        rejectValue: string;
    }
>("agent/login", async (payload, thunkAPI) => {
    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // IMPORTANT for cookies
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            return thunkAPI.rejectWithValue(data.message);
        }

        return {
            agent: data.user,
            accessToken: data.accessToken,
        };
    } catch (err: any) {
        return thunkAPI.rejectWithValue("Login failed");
    }
});

export const loadAgent = createAsyncThunk(
    "agent/loadAgent",
    async (_, { rejectWithValue }) => {
        const res = await fetch("/api/me", {
            credentials: "include", // VERY IMPORTANT
        });


        if (!res.ok) throw new Error("Unauthorized");


        const data = await res.json();

        return {
            agent: data.user,
            accessToken: data.accessToken,
        };
    }
);

/* ---------------- SLICE ---------------- */

const agentSlice = createSlice({
    name: "agent",
    initialState,
    reducers: {
        logoutAgent: (state) => {
            state.agent = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        setAgentFromSession: (state, action: PayloadAction<Agent>) => {
            state.agent = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAgent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAgent.fulfilled, (state, action) => {
                state.loading = false;
                state.agent = action.payload.agent;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(loginAgent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
                state.isAuthenticated = false;
            });

        builder
            .addCase(loadAgent.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadAgent.fulfilled, (state, action) => {
                console.log("Redux fulfilled payload:", action.payload);
                state.agent = action.payload.agent;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loadAgent.rejected, (state) => {
                state.loading = false;
                state.agent = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { logoutAgent, setAgentFromSession } = agentSlice.actions;
export default agentSlice.reducer;