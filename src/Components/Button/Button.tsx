// Button.tsx
import React from "react";
import styles from "./Button.module.css";
import { ButtonProps } from "../../types";

// Update ButtonProps to include onClick

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  type = "button",
  disabled = false,
  className,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary
      } ${className}`}
      disabled={disabled}
      tabIndex={0}
      onClick={onClick} // Pass onClick prop to the button
    >
      {children}
    </button>
  );
};
