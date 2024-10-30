import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import ChemicalInventory from "./components/chemicalinventory";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={<Login onLoginSuccess={handleLoginSuccess} />} 
        />

        {/* Chemical Inventory Route - Redirect if not logged in */}
        <Route 
          path="/chemicalinventory" 
          element={
            isLoggedIn ? <ChemicalInventory /> : <Navigate to="/" />
          } 
        />

        {/* Catch-all route to redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
