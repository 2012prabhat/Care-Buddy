import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../auth/api";

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctors");
      return response.data.data; // Assuming API returns doctors list in the `data` field
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
  },
});


export default doctorsSlice.reducer;