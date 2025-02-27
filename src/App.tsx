import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage/HomePage";
import { RegistrationPage } from "./Pages/RegistrationPage/RegistrationPage";
import { LoginPage } from "./Pages/LoginPage/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ClientManagement from "./Pages/ClientManagement/ClientManagement";
import RoleManagement from "./Pages/RoleManagement/RoleManagement";
import UserManagement from "./Pages/UserManagement/UserManagement";
import "./App.css";
import { Navbar } from "./Components/Navbar/Navbar";
import { Footer } from "./Components/Footer/Footer";
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Navbar
        logo="https://cdn.builder.io/api/v1/image/assets/TEMP/7f349371a37497d7f8be7b7597da01bc1665fd0f7f145d9e7b4722d625af319c?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a"
        companyName="PPF Management"
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-management"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <ClientManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/role-management"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <RoleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer
        logo="https://cdn.builder.io/api/v1/image/assets/TEMP/848109440ac586a526101923f72479b60571b498f2689af635a6277b6ff83324?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a"
        companyName="PPF Management"
      />
    </div>
  );
}

export default App;
