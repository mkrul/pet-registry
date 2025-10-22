import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../app/AppRouter";
import { ThemeProvider } from "../shared/contexts/ThemeContext";

const App = () => {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
