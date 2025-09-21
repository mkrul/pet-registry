import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../../src/app/AppRouter";

const App = () => {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
