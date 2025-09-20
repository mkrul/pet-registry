import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../types/redux/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
