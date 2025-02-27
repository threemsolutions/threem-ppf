import React from "react";
import styles from "./Footer.module.css";
import { FooterProps } from "../../types";

export const Footer: React.FC<FooterProps> = ({ logo, companyName }) => {
  return (
    <footer className={styles.footer}>
      <img
        src={logo}
        alt={`${companyName} Logo`}
        className={styles.footerLogo}
      />

      <div className={styles.companyName}>{companyName}</div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {companyName}. All Rights Reserved.
      </p>
    </footer>
  );
};
