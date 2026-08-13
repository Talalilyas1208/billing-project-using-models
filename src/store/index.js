import { configureStore } from '@reduxjs/toolkit';
import billingReducer from './slices/billingSlice';

const store = configureStore({
  reducer: {
    billing: billingReducer,
  },
});

export default store;
