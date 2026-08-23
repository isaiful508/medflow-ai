import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPatients, createPatient as svcCreatePatient } from "@/services/PatientsService";
import type { Patient } from "@/types";

export interface PatientsState {
  list: Patient[];
  selectedPatientId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientsState = {
  list: [],
  selectedPatientId: null,
  isLoading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk<Patient[], void, { rejectValue: string }>(
  "patients/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await getPatients();
      if (!response.success) return thunkAPI.rejectWithValue(response.message || "Unable to load patients");

      const patients = (response.data as any[]) || [];
      return patients.map((patient) => ({
        id: Number(patient.patientId || patient.id || Date.now()),
        name: String(patient.fullName || patient.name || ""),
        email: String(patient.email || ""),
        phone: String(patient.phone || ""),
        gender: (patient.gender as Patient["gender"]) || "Male",
        dateOfBirth: String(patient.dateOfBirth || ""),
        bloodGroup: String(patient.bloodGroup || ""),
        status: (patient.status as Patient["status"]) || "Active",
        lastVisit: String(patient.lastVisit || ""),
        doctor: String(patient.doctor || ""),
        allergies: String(patient.allergies || ""),
        emergencyContactName: String(patient.emergencyContactName || ""),
        emergencyContactPhone: String(patient.emergencyContactPhone || ""),
        notes: String(patient.notes || ""),
      }));
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error)?.message || "Unable to load patients");
    }
  }
);

export const deletePatient = createAsyncThunk<{ id: number }, { id: number }, { rejectValue: string }>(
  "patients/delete",
  async ({ id }, thunkAPI) => {
    try {
      // call backend delete endpoint directly
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:5000/api"}/patients/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue((body && body.message) || "Unable to delete patient");
      }
      return { id };
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error)?.message ?? "Unable to delete patient");
    }
  }
);

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    selectPatient: (state, action: PayloadAction<number | null>) => {
      state.selectedPatientId = action.payload;
    },
    updatePatientLocal: (state, action: PayloadAction<Patient>) => {
      state.list = state.list.map((p) => (p.id === action.payload.id ? action.payload : p));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.isLoading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.list = [action.payload, ...state.list];
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload.id);
      });
  },
});

export const { selectPatient } = patientsSlice.actions;
export default patientsSlice.reducer;
