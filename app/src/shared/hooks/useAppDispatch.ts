import { useDispatch } from "react-redux";
import { AppDispatch } from "../types/redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
