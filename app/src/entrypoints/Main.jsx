import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../app/AppRouter";

const App = () => {
  console.log("🏠 Main.jsx: App component rendering");
  const [error, setError] = useState(null);

  if (error) {
    console.error("❌ Main.jsx: Error state active:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  console.log("🌐 Main.jsx: Rendering BrowserRouter with AppRouter");
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
