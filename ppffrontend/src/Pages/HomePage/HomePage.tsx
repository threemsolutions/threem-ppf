import React from "react";
import styles from "./HomePage.module.css";
import { Navbar } from "../../Components/Navbar/Navbar";
import { HeroSection } from "../../Components/HeroSection/HeroSection";
import { Footer } from "../../Components/Footer/Footer";

export const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <main>
        <HeroSection
          title="Streamline Your Management with PPF Management System"
          description="PPF Management System offers a comprehensive solution for managing clients and users efficiently. With tailored dashboards for super admins, admins, and users, you can easily oversee operations and enhance productivity."
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/90060dc613bb57b5d0f0f9846f97eebf4af7b1f61c828041468faceac5442b0f?placeholderIfAbsent=true&apiKey=e48a893f9b314af2a9e1cefb2b07135a"
        />
      </main>
    </div>
  );
};
