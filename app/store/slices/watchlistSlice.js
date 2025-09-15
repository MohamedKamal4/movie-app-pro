'use client'

import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("watchlist");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading watchlist:", error);
    return [];
  }
};

const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem("watchlist", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving watchlist:", error);
  }
};

const initialState = {
  items: typeof window !== "undefined" ? loadFromLocalStorage() : [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      const exists = state.items.find((el) => el.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveToLocalStorage(state.items);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((el) => el.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    toggleWatchlist: (state, action) => {
      const exists = state.items.find((el) => el.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((el) => el.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      saveToLocalStorage(state.items);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
