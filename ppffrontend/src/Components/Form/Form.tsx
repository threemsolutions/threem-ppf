import React from "react";
import styles from "./Form.module.css";
import { FormInputProps } from "../../types";

export const Form: React.FC<FormInputProps> = ({
  label,
  type = "text",
  id,
  placeholder,
  trigger,
  register,
  error,
  roles = [],
  loading = false,
  fetchError = null,
}) => {
  const handleBlur = async () => {
    console.log(`${id} blurred`);
    await trigger(id); // Trigger validation for this field onBlur
  };
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.formLabel}>
        {label}
        <span className={styles.required}>*</span>
      </label>
      {type === "dropdown" ? (
        <select
          id={id}
          className={styles.formInput}
          {...register(id)}
          aria-invalid={!!error}
          onBlur={handleBlur}
        >
          <option value="">Select {label}</option>
          {loading && <option disabled>Loading...</option>}
          {fetchError && <option disabled>{fetchError}</option>}
          {!loading &&
            !fetchError &&
            roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.roleName} {/* Display the role name */}
              </option>
            ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          className={styles.formInput}
          placeholder={placeholder}
          aria-label={label}
          {...register(id)}
          aria-invalid={!!error}
          onBlur={handleBlur}
        />
      )}{" "}
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
};
