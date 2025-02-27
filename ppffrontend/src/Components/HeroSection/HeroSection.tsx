import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { Button } from "../Button/Button";
import { HeroSectionProps } from "../../types";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroTextContent}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroDescription}>{description}</p>
          <div className={styles.heroActions}></div>
        </div>
        <div className={styles.heroImageWrapper}>
          <img
            src={image}
            alt="PPF Management System Interface"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};
