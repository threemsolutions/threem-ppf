import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Form } from "../../Components/Form/Form";
import { GenderSelect } from "../../Components/GenderSelect/GenderSelect";
import { Footer } from "../../Components/Footer/Footer";
import { useAuth } from "../../Context/UseAuth";
import { fetchRoles } from "../../api";
import { toast } from "react-toastify";
import styles from "./RegistrationPage.module.css";
import { Button } from "../../Components/Button/Button";

// Validation Schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  dob: Yup.string().required("Date of Birth is required"),
  roleId: Yup.string().required("Role is required"),
  gender: Yup.string().required("Gender is required"),
});

export const RegistrationPage: React.FC = () => {
  const { registerUser } = useAuth();
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
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

  const onSubmit = async (data: any) => {
    console.log("Submitting Form Data:", data);

    const userData = {
      ...data,
      roleId: parseInt(data.roleId, 10),
      contactNumber: data.phone,
      emailId: data.email,
    };

    delete userData.email; // Remove the 'email' field since the backend expects 'emailId'

    console.log("Final User Data:", userData); // Debugging log

    try {
      await registerUser(userData);
      console.log("User registration API call successful");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <section className={styles.registerSection}>
          <h2 className={styles.title}>Get Started</h2>
          <p className={styles.description}>
            Create your account to access our management system.
          </p>

          <form className={styles.registrationForm}>
            <div className={styles.formColumns}>
              <div className={styles.formColumn}>
                <Form
                  label="First Name:"
                  id="firstName"
                  register={register}
                  error={errors.firstName}
                  placeholder="First Name"
                  trigger={trigger}
                />
                <Form
                  label="Email Id:"
                  id="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="example@email.com"
                  trigger={trigger}
                />
                <Form
                  label="Password:"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  register={register}
                  error={errors.password}
                  trigger={trigger}
                />

                <Form
                  label="Role:"
                  id="roleId"
                  type="dropdown"
                  register={register}
                  error={errors.roleId}
                  roles={roles}
                  loading={loading}
                  fetchError={fetchError}
                  trigger={trigger}
                />
                <GenderSelect
                  label="Gender:"
                  register={register}
                  error={errors.gender}
                />
              </div>

              <div className={styles.formColumn}>
                <Form
                  label="Last Name:"
                  id="lastName"
                  register={register}
                  error={errors.lastName}
                  placeholder="Last Name"
                  trigger={trigger}
                />
                <Form
                  label="Phone Number:"
                  id="phone"
                  type="tel"
                  register={register}
                  error={errors.phone}
                  placeholder="9876543210"
                  trigger={trigger}
                />
                <Form
                  label="DOB"
                  id="dob"
                  type="date"
                  register={register}
                  error={errors.dob}
                  trigger={trigger}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className={`${styles.submitButton} ${
                !isValid ? styles.disabledButton : ""
              }`}
            >
              Register
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
};
