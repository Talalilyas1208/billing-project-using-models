import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
  themeMode: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
  },
});

export const { toggleSidebar, setThemeMode } = uiSlice.actions;
export default uiSlice.reducer;
