import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

export interface FormInputEvent {
  target: {
    name: string;
    value: string | null;
  };
}
