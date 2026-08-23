import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getDoctors, createDoctor as svcCreateDoctor } from "@/services/DoctorsService";
import type { Doctor } from "@/types";

export interface DoctorsState {
  list: Doctor[];
  selectedDoctorId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DoctorsState = {
  list: [],
  selectedDoctorId: null,
  isLoading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk<Doctor[], void, { rejectValue: string }>(
  "doctors/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await getDoctors();
      if (!response.success) return thunkAPI.rejectWithValue(response.message || "Unable to load doctors");

      const doctors = (response?.data?.data as any[]) || [];
      return doctors.map((doctor) => ({
        id: Number(doctor.doctorId || doctor.id || Date.now()),
        name: String(doctor.fullName || doctor.name || ""),
        specialty: String(doctor.specialty || ""),
        email: String(doctor.email || ""),
        phone: String(doctor.phone || ""),
        gender: (doctor.gender as Doctor["gender"]) || "Male",
        licenseNumber: String(doctor.licenseNumber || ""),
        qualification: String(doctor.qualification || ""),
        experienceYears: Number(doctor.experienceYears || 0),
        department: String(doctor.department || ""),
        consultationFee: Number(doctor.consultationFee || 0),
        availability: String(doctor.availability || ""),
        status: (doctor.status as Doctor["status"]) || "Available",
      }));
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error)?.message || "Unable to load doctors");
    }
  }
);


export const deleteDoctor = createAsyncThunk<{ id: number }, { id: number }, { rejectValue: string }>(
  "doctors/delete",
  async ({ id }, thunkAPI) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:5000/api"}/doctors/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue((body && body.message) || "Unable to delete doctor");
      }
      return { id };
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error)?.message ?? "Unable to delete doctor");
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    selectDoctor: (state, action: PayloadAction<number | null>) => {
      state.selectedDoctorId = action.payload;
    },
    updateDoctorLocal: (state, action: PayloadAction<Doctor>) => {
      state.list = state.list.map((d) => (d.id === action.payload.id ? action.payload : d));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.isLoading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
      })
      .addCase(createDoctor.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.list = [action.payload, ...state.list];
      });
    builder.addCase(deleteDoctor.fulfilled, (state, action) => {
      state.list = state.list.filter((d) => d.id !== action.payload.id);
    });
  },
});

export const { selectDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
