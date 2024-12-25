import { NavigateFunction } from "react-router-dom";

export const navigateToHome = (navigate: NavigateFunction) => {
  console.log("🚗 navigateToHome called with:", navigate);
  navigate("/");
  console.log("✨ Navigation to home completed");
};
