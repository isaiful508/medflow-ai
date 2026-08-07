import { combineReducers, createStore } from "redux";
import { doctorsReducer, DoctorsState } from "@/store/doctorSlice";
import { patientsReducer, PatientsState } from "@/store/patientSlice";

export interface RootState {
  doctors: DoctorsState;
  patients: PatientsState;
}

const rootReducer = combineReducers({
  doctors: doctorsReducer,
  patients: patientsReducer,
});

export const store = createStore(rootReducer);
