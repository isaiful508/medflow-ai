import { configureStore } from "@reduxjs/toolkit";
import doctorsReducer from "@/store/doctorSlice";
import patientsReducer from "@/store/patientSlice";

export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    patients: patientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
