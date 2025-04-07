import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./components/login";
import ChemicalInventory from "./components/chemicalinventory";
import CSVFile from "./components/csvFile";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // Listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // handle logout
  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Return the router with all the routes
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/chemicalinventory" : "/login"} />
          }
        />

        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            ) : (
              <Navigate to="/chemicalinventory" />
            )
          }
        />

        <Route
          path="/chemicalinventory"
          element={
            isLoggedIn ? (
              <ChemicalInventory onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/export-csv"
          element={isLoggedIn ? <CSVFile /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
