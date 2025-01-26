// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './slices/doctorSlice'


const store = configureStore({
  reducer: {
    doctors:doctorReducer
  },
});

export default store;
