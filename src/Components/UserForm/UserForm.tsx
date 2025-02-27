import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./UserForm.module.css";
import { Button } from "../Button/Button";
import { User, UserFormProps, UserFormValues } from "../../types";
import { fetchRoles } from "../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  emailId: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  status: Yup.number()
    .oneOf([0, 1, 2], "Invalid status")
    .required("Status is required"),
  dob: Yup.string().required("Date of Birth is required"),
  roleId: Yup.string().required("Role is required"),
  gender: Yup.string().required("Gender is required"),
});

const UserForm: React.FC<UserFormProps> = ({
  user,
  onUserSaved,
  isViewing,
  isEditing,
  handleUpdate,
}) => {
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      status: 1,
      emailId: "",
      contactNumber: "",
      dob: "",
      gender: "",
      roleId: "",
      password: "",
    },
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        setFetchError("Error fetching roles");
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    if (user && user.id !== 0) {
      reset({
        ...user,
        roleId: user.roleId ? String(user.roleId) : "",
        dob: user.dob ? user.dob.split("T")[0] : "", // Extract only the date part
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        gender: "",
        password: "",
        emailId: "",
        contactNumber: "",
        roleId: "",
        status: 3,
        dob: "",
      });
    }
  }, [user, reset, roles]);

  const onSubmit = async (data: UserFormValues) => {
    const userToSend: User = {
      id: user?.id ?? 0,
      ...data,
    };

    if (isEditing && user?.id !== 0) {
      await handleUpdate(userToSend);
    }

    onUserSaved();
  };

  return (
    <form className={styles.userForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>
            First Name:<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("firstName")}
          />
          <p className={styles.error}>{errors.firstName?.message}</p>
        </div>

        <div className={styles.formGroup}>
          <label>
            Last Name:<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("lastName")}
          />
          <p className={styles.error}>{errors.lastName?.message}</p>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>
            Email:<span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            {...register("emailId")}
            placeholder="company@example.com"
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("emailId")}
          />
          <p className={styles.error}>{errors.emailId?.message}</p>
        </div>

        <div className={styles.formGroup}>
          <label>
            Contact Number:<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            {...register("contactNumber")}
            placeholder="9876543210"
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("contactNumber")}
          />
          <p className={styles.error}>{errors.contactNumber?.message}</p>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>
            Password:<span className={styles.required}>*</span>
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              disabled={isViewing || !isEditing}
              onBlur={() => trigger("password")}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            <p className={styles.error}>{errors.password?.message}</p>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>
            Date of Birth:<span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            {...register("dob")}
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("dob")}
          />
          <p className={styles.error}>{errors.dob?.message}</p>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>
            Gender:<span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="male"
                {...register("gender")}
                disabled={isViewing || !isEditing}
                onBlur={() => trigger("gender")}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                value="female"
                {...register("gender")}
                disabled={isViewing || !isEditing}
                onBlur={() => trigger("gender")}
              />{" "}
              Female
            </label>
          </div>
          <p className={styles.error}>{errors.gender?.message}</p>
        </div>
        <div className={styles.formGroup}>
          <label>
            Role:<span className={styles.required}>*</span>
          </label>
          <select
            {...register("roleId")}
            disabled={isViewing || !isEditing}
            onBlur={() => trigger("roleId")}
          >
            <option value="" disabled hidden>
              Select Role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={String(role.id)}>
                {role.roleName}
              </option>
            ))}
          </select>
          <p className={styles.error}>{errors.roleId?.message}</p>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>
          Status:<span className={styles.required}>*</span>
        </label>
        <select
          {...register("status")}
          disabled={isViewing || !isEditing}
          onBlur={() => trigger("status")}
        >
          <option value={3} disabled hidden>
            Select Status
          </option>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
          <option value={2}>Delete</option>
        </select>
        <p className={styles.error}>{errors.status?.message}</p>
      </div>
      {isEditing && (
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          className={styles.submitButton}
        >
          Update User
        </Button>
      )}
    </form>
  );
};

export default UserForm;
