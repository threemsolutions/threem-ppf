import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../api";
import { toast } from "react-toastify";
import axios from "axios";
import { UserProfile } from "../Models/User";
import { jwtDecode } from "jwt-decode";

type UserContextType = {
  registerUser: (data: any) => Promise<void>;
  loginUser: (emailId: string, password: string) => Promise<void>;
  token: string | null;
  logout: () => void;
  isLoggedIn: () => boolean;
  emailId: UserProfile | null;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [emailId, setEmailId] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const emailId = localStorage.getItem("emailId");
    if (emailId && token) {
      setEmailId(JSON.parse(emailId));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer" + token;
    }
    setIsReady(true);
  }, []);
  const registerUser = async (data: any) => {
    try {
      await registerAPI(data);
      toast.success("Registration Successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };
  const loginUser = async (emailId: string, password: string) => {
    try {
      const response = await loginAPI(emailId, password);
      if (response) {
        const token = response?.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("emailId", emailId);

        // Decode token to get roleId
        const decodedToken: any = jwtDecode(token);
        console.log("🔍 Decoded Token:", decodedToken); // Debugging step
        const roleId = decodedToken.RoleId;
        console.log("🔍 Extracted roleId:", roleId); // Debugging step

        localStorage.setItem("roleId", roleId);
        const userId = decodedToken.UserId;
        localStorage.setItem("userId", userId);
        toast.success("Login Succesfull");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const isLoggedIn = () => {
    return !!emailId;
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("emailId");
    localStorage.removeItem("userId");
    setEmailId(null);

    setToken("");
    toast.success("Logout successful");
    navigate("/");
  };
  return (
    <UserContext.Provider
      value={{ registerUser, loginUser, token, logout, isLoggedIn, emailId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
