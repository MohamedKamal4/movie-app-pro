'use client'
import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

const initialState = {
  items: typeof window !== "undefined" ? loadFromLocalStorage() : [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.find((el) => el.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveToLocalStorage(state.items);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((el) => el.id !== action.payload);
      saveToLocalStorage(state.items);
    },
    toggleFavorite: (state, action) => {
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

export const { addFavorite, removeFavorite, toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
