import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "./Dashboard.module.css";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Section } from "../../Components/Section/Section";
import { Footer } from "../../Components/Footer/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found! Redirecting to login...");
      navigate("/login");
      return;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const extractedRoleId = Number(decodedToken.RoleId);
      if (!isNaN(extractedRoleId)) {
        setRoleId(extractedRoleId);
      } else {
        console.error("🚨 Invalid RoleId in token:", decodedToken.RoleId);
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Invalid token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const getRoleView = () => {
    if (roleId === 1) return <SuperAdminView />;
    if (roleId === 2) return <AdminView />;
    if (roleId === 3) return <UserView />;
    return <p>Loading...</p>; // Fallback while waiting for roleId
  };

  return <div className={styles.dashboard}>{getRoleView()}</div>;
};

const SuperAdminView = () => {
  return (
    <div>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome,Super Admin</h1>
        <p className={styles.welcomeDescription}>
          You have full control over the management of clients and users in the
          system.
        </p>
      </div>
      <Section
        tagline="Client Management"
        heading="View and Manage Clients"
        description="As a Super Admin, you have the power to oversee all registered companies within the PPF Management System. This centralized view allows for efficient management and oversight of users, roles and clients."
        cards={[
          {
            title: "Client List",
            description:
              "Access a comprehensive list of all registered Companies at your fingertips.",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/95bcd00233d75dd56f463c14335eceb2eb99c46acb82e9e49543a8de30ec595b?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "Client list icon",
          },
          {
            title: "Client Initiatives",
            description: "Easily add, update, or remove companies as needed",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/8dea98160e931781a97154cfcee8d6b5fe4dd24ea4ddbc58fd818bb5c651c5f9?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "Client initiatives icon",
          },
        ]}
      />

      {/* View Roles Section */}
      <Section
        tagline="Role Management"
        heading="View and Manage Roles"
        description="As a Super Admin, you have the power to oversee all registered Roles within the PPF Management System. This feature allows for efficient management and oversight, ensuring a streamlined experience."
        cards={[
          {
            title: "Role List",
            description:
              "Access a comprehensive list of all registered users at your fingertips.",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/95bcd00233d75dd56f463c14335eceb2eb99c46acb82e9e49543a8de30ec595b?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "Role list icon",
          },
          {
            title: "Role Actions",
            description: "Easily update, or remove users as needed.",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/8dea98160e931781a97154cfcee8d6b5fe4dd24ea4ddbc58fd818bb5c651c5f9?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "Role actions icon",
          },
        ]}
      />

      {/* View Users Section */}
      <Section
        tagline="Overview"
        heading="Manage All Registered Users Seamlessly"
        description="As a Super Admin, you have the power to oversee all registered users within the PPF Management System. This feature allows for efficient management and oversight, ensuring a streamlined experience."
        cards={[
          {
            title: "User List",
            description:
              "Access a comprehensive list of all registered users at your fingertips.",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/fa6119d5f81204fe6d3516d96540d57df07aacd17aae3a163ee6969b8454b114?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "User list icon",
          },
          {
            title: "User Actions",
            description: "Easily update, or remove users as needed.",
            iconSrc:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/fa6119d5f81204fe6d3516d96540d57df07aacd17aae3a163ee6969b8454b114?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
            iconAlt: "User actions icon",
          },
        ]}
      />
    </div>
  );
};

const AdminView = () => (
  <div>
    <div className={styles.welcomeSection}>
      <h1 className={styles.welcomeTitle}>Welcome, Admin</h1>
      <p className={styles.welcomeDescription}>
        You have full control over the management of users in the system.
      </p>
    </div>
    <Section
      tagline="Overview"
      heading="Manage All Registered Users Seamlessly"
      description="As a  Admin, you have the power to oversee all registered users within the PPF Management System. This feature allows for efficient management and oversight, ensuring a streamlined experience."
      cards={[
        {
          title: "User List",
          description:
            "Access a comprehensive list of all registered users at your fingertips.",
          iconSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/fa6119d5f81204fe6d3516d96540d57df07aacd17aae3a163ee6969b8454b114?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
          iconAlt: "User list icon",
        },
        {
          title: "User Actions",
          description: "Easily update, or remove users as needed.",
          iconSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/fa6119d5f81204fe6d3516d96540d57df07aacd17aae3a163ee6969b8454b114?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
          iconAlt: "User actions icon",
        },
      ]}
    />
  </div>
);
const UserView = () => (
  <div>
    <div className={styles.welcomeSection}>
      <h1 className={styles.welcomeTitle}>Welcome,User</h1>
      <p className={styles.welcomeDescription}>
        Welcome to PPF Management System
      </p>
    </div>
    <Section
      tagline="Overview"
      heading="Access comprehensive details about your personal PPF account at your fingertips"
      description="As a user you can view your ppf details"
      cards={[
        {
          title: "User Detalis",
          description: "Access your details at fingertips",
          iconSrc:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/fa6119d5f81204fe6d3516d96540d57df07aacd17aae3a163ee6969b8454b114?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a",
          iconAlt: "User list icon",
        },
      ]}
    />
  </div>
);

export default Dashboard;
