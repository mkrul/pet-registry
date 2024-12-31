import { UserProps } from "../User";

export interface AuthResponse {
  message: string;
  user: UserProps;
}

export interface SignUpRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}
