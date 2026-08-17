import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import formReducer from './slices/formSlice';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    form: formReducer,
    profile: profileReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;
