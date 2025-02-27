import React from "react";
import styles from "./OverviewCard.module.css";
import { OverviewCardProps } from "../../types";

export const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  description,
  iconSrc,
  iconAlt,
}) => (
  <div className={styles.overviewCard}>
    <img
      loading="lazy"
      src={iconSrc}
      alt={iconAlt}
      className={styles.cardIcon}
    />
    <div className={styles.cardTitle}>{title}</div>
    <div className={styles.cardDescription}>{description}</div>
  </div>
);
