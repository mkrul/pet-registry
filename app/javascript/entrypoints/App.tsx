import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../src/redux/store";
import AppRouter from "../../src/components/common/AppRouter";
import AuthProvider from "../../src/components/auth/AuthProvider";

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
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
