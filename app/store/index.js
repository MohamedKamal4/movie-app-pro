'use client'

import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./slices/favoriteSlice";
import watchlistReducer from "./slices/watchlistSlice";

export const store = configureStore({
  reducer: {
    favorite: favoriteReducer,
    watchlist: watchlistReducer,
  },
});
