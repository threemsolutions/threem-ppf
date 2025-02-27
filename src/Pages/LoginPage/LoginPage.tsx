import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";
import styles from "./LoginPage.module.css";
import { Form } from "../../Components/Form/Form";
import { Button } from "../../Components/Button/Button";
import { useAuth } from "../../Context/UseAuth";

const validationSchema = Yup.object().shape({
  emailId: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const LoginPage: React.FC = () => {
  const { loginUser } = useAuth();
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

  const onSubmit = async (data: any) => {
    console.log("Login Button Clicked");
    loginUser(data.emailId, data.password);
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <section className={styles.loginSection}>
          <h2 className={styles.title}>User Login</h2>
          <p className={styles.description}>
            Access your account securely and easily
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formColumns}>
              <div className={styles.formColumn}>
                <Form
                  label="Email ID:"
                  id="emailId"
                  type="email"
                  register={register}
                  error={errors.emailId}
                  placeholder="example@email.com"
                  trigger={trigger}
                />
                <Form
                  label="Password:"
                  id="password"
                  type="password"
                  register={register}
                  error={errors.password}
                  placeholder="Enter your password"
                  trigger={trigger}
                />
              </div>
            </div>
            <Button
              variant="secondary"
              type="submit"
              className={`${styles.submitButton} ${
                !isValid ? styles.disabledButton : ""
              }`}
              onClick={handleSubmit(onSubmit)}
            >
              Login
            </Button>
            <p className={styles.signupPrompt}>
              Don't have an account?{" "}
              <a href="/register" className={styles.signupLink}>
                Sign Up
              </a>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};
