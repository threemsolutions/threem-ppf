import React from "react";
import styles from "./Section.module.css";
import { OverviewCard } from "../OverviewCard/OverviewCard";
import { SectionProps } from "../../types";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router";

export const Section: React.FC<SectionProps> = ({
  tagline,
  heading,
  description,
  cards,
}) => {
  const navigate = useNavigate();

  // Define routes dynamically
  const sectionRoutes: Record<string, string> = {
    Client: "/client-management",
    Role: "/role-management",
    User: "/user-management",
    personal: "/user-management",
  };

  // Determine the correct section key
  const sectionKey = Object.keys(sectionRoutes).find((key) =>
    heading.includes(key)
  );

  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div className={styles.tagline}>{tagline}</div>
          <div className={styles.heading}>{heading}</div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.description}>{description}</div>
          <div className={styles.cardsContainer}>
            {cards.map((card, index) => (
              <OverviewCard key={index} {...card} />
            ))}
          </div>

          {/* Render buttons dynamically */}
          {sectionKey && (
            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={() => navigate(sectionRoutes[sectionKey])}
              >
                Manage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
