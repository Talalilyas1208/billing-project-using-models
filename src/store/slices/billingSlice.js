import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.totalAmount += action.payload.price * action.payload.quantity;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const item = state.items[index];
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(index, 1);
      }
    },
    clearItems: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addItem, removeItem, clearItems } = billingSlice.actions;
export default billingSlice.reducer;
