// agent/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import agentReducer from './slices/agentSlice';
import createEventReducer from './slices/createEventSlice';

export const store = configureStore({
  reducer: {
    // your reducers here
    agent: agentReducer,
    createEvent: createEventReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];