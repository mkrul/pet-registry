import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "../../src/app/AppRouter";

const App = () => {
  console.log("🏠 Main.jsx: App component rendering");

  // Test component to verify React is still working
  console.log("🧪 Main.jsx: Rendering test component after build success");
  return (
    <div style={{
      backgroundColor: 'lightgreen',
      padding: '20px',
      margin: '20px',
      border: '2px solid green',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>✅ Build Success Test</h1>
      <p>Build completed successfully!</p>
      <p>If you see this, React mounting is working.</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );

  // Original AppRouter code (commented out for testing):
  // console.log("🌐 Main.jsx: Rendering BrowserRouter with AppRouter");
  // try {
  //   return (
  //     <BrowserRouter>
  //       <AppRouter />
  //     </BrowserRouter>
  //   );
  // } catch (error) {
  //   console.error("❌ Main.jsx: Error rendering BrowserRouter/AppRouter:", error);
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-red-500">Error loading app: {error.message}</p>
  //     </div>
  //   );
  // }
};

export default App;
