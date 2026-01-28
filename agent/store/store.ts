// agent/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // your reducers here
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];