import React from "react";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
