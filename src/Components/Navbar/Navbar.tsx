import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Button } from "../Button/Button";
import { NavbarProps } from "../../types";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar: React.FC<NavbarProps> = ({ logo, companyName }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, [location]);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("emailId");
    localStorage.removeItem("roleId");
    setIsLoggedIn(false); // Update the login state
    navigate("/"); // Redirect to login page
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the home page
  };
  const handleDashboardClick = () => {
    navigate("/dashboard");
  };
  return (
    <nav className={styles.navbar}>
      <img
        src={logo}
        alt="PPF Management Logo"
        className={styles.navLogo}
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />
      <div className={styles.companyName}>{companyName}</div>
      <div className={styles.navButtons}>
        {!isLoggedIn ? (
          <>
            {location.pathname !== "/register" && (
              <Button variant="primary" onClick={handleRegisterClick}>
                Register
              </Button>
            )}
            {location.pathname !== "/login" && (
              <Button variant="secondary" onClick={handleLoginClick}>
                Login
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="primary" onClick={handleLogoutClick}>
              Logout
            </Button>
            {location.pathname !== "/dashboard" && (
              <Button variant="secondary" onClick={handleDashboardClick}>
                Dashboard
              </Button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
