import { UserProps } from "../../../shared/types/User";

export interface AuthState {
  user: UserProps | null;
  isAuthenticated?: boolean;
}
