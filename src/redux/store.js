import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import uiReducer from './slices/uiSlice';
import { api } from './api/api';
import { blackListApi } from './api/blackListApi';

// Custom localStorage storage engine for redux-persist compatibility in Vite
const localStorageEngine = {
  getItem: (key) => {
    try {
      return Promise.resolve(window.localStorage.getItem(key));
    } catch (e) {
      return Promise.reject(e);
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

const rootReducer = combineReducers({
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
  [blackListApi.reducerPath]: blackListApi.reducer,
});

/**
 * Redux Persist Whitelist vs. Blacklist Rules
 * Whitelisted: 'ui', 'api' (handles rehydration info for cached metadata)
 * Blacklisted: 'blackListApi' (bypasses local storage to force real-time re-fetching)
 */
const persistConfig = {
  key: 'root',
  storage: localStorageEngine,
  whitelist: ['ui', api.reducerPath],
  blacklist: [blackListApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, blackListApi.middleware),
});

export const persistor = persistStore(store);
