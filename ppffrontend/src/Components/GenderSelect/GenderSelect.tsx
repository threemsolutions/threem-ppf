import React from "react";
import styles from "./GenderSelect.module.css";
import { GenderSelectProps } from "../../types";

export const GenderSelect: React.FC<GenderSelectProps> = ({
  label,
  register,
  error,
}) => (
  <div className={styles.genderGroup}>
    <span className={styles.formLabel}>
      {label}
      <span className={styles.required}>*</span>
    </span>
    <div className={styles.genderOptions}>
      <label className={styles.radioLabel}>
        <input
          type="radio"
          {...register("gender")}
          value="male"
          className={styles.radioInput}
        />
        <span className={styles.radioControl}></span>
        <span className={styles.radioText}>Male</span>
      </label>

      <label className={styles.radioLabel}>
        <input
          type="radio"
          {...register("gender")}
          value="female"
          className={styles.radioInput}
        />
        <span className={styles.radioControl}></span>
        <span className={styles.radioText}>Female</span>
      </label>
    </div>

    {/* Display validation error if gender is not selected */}
    {error && <p className={styles.error}>{error.message}</p>}
  </div>
);
