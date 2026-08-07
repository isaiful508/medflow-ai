import { Doctor } from "@/store/types";

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

type DoctorsAction =
  | { type: "doctors/loadStart" }
  | { type: "doctors/loadSuccess"; payload: Doctor[] }
  | { type: "doctors/loadFailure"; payload: string }
  | { type: "doctors/select"; payload: number | null }
  | { type: "doctors/add"; payload: Doctor }
  | { type: "doctors/update"; payload: Doctor }
  | { type: "doctors/remove"; payload: number };

export const doctorsReducer = (
  state = initialState,
  action: DoctorsAction
): DoctorsState => {
  switch (action.type) {
    case "doctors/loadStart":
      return { ...state, isLoading: true, error: null };
    case "doctors/loadSuccess":
      return { ...state, isLoading: false, list: action.payload, error: null };
    case "doctors/loadFailure":
      return { ...state, isLoading: false, error: action.payload };
    case "doctors/select":
      return { ...state, selectedDoctorId: action.payload };
    case "doctors/add":
      return { ...state, list: [...state.list, action.payload] };
    case "doctors/update":
      return {
        ...state,
        list: state.list.map((doctor) =>
          doctor.id === action.payload.id ? action.payload : doctor
        ),
      };
    case "doctors/remove":
      return {
        ...state,
        list: state.list.filter((doctor) => doctor.id !== action.payload),
      };
    default:
      return state;
  }
};
