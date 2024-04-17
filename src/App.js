import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import PurchaseAndSalePlanning from "./pages/PurchaseAndSalePlanning/PurAndSalePlanning";
import SignIn from "./pages/SignIn/SignIn";
import Logout from "./auth/Logout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect the base URL to login initially */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          {/* Make /login the "home" page */}
          <Route path="/login" element={<SignIn />} />

          {/* Protect the /purandsaleplanning route */}
          <Route
            path="/purandsaleplanning"
            element={
              <ProtectedRoute>
                <PurchaseAndSalePlanning />
              </ProtectedRoute>
            }
          />
          {/* Logout route */}

          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
