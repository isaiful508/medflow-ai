import { Patient } from "@/store/types";

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

type PatientsAction =
  | { type: "patients/loadStart" }
  | { type: "patients/loadSuccess"; payload: Patient[] }
  | { type: "patients/loadFailure"; payload: string }
  | { type: "patients/select"; payload: number | null }
  | { type: "patients/add"; payload: Patient }
  | { type: "patients/update"; payload: Patient }
  | { type: "patients/remove"; payload: number };

export const patientsReducer = (
  state = initialState,
  action: PatientsAction
): PatientsState => {
  switch (action.type) {
    case "patients/loadStart":
      return { ...state, isLoading: true, error: null };
    case "patients/loadSuccess":
      return { ...state, isLoading: false, list: action.payload, error: null };
    case "patients/loadFailure":
      return { ...state, isLoading: false, error: action.payload };
    case "patients/select":
      return { ...state, selectedPatientId: action.payload };
    case "patients/add":
      return { ...state, list: [...state.list, action.payload] };
    case "patients/update":
      return {
        ...state,
        list: state.list.map((patient) =>
          patient.id === action.payload.id ? action.payload : patient
        ),
      };
    case "patients/remove":
      return {
        ...state,
        list: state.list.filter((patient) => patient.id !== action.payload),
      };
    default:
      return state;
  }
};
