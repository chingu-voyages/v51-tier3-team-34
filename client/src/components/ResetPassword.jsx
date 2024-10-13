import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const [resMessage, setResMessage] = useState("");

  const formSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(12, "Password cannot be more than 12 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .test(
        "no-repeating",
        "Password cannot contain repeating characters",
        (value) => {
          return !/(.)\1\1/.test(value); // checks for repeating characters
        },
      )
      .test(
        "no-sequential",
        "Password cannot contain sequential characters",
        (value) => {
          const hasSequential = (str) => {
            for (let i = 0; i < str.length - 2; i++) {
              if (
                str.charCodeAt(i) + 1 === str.charCodeAt(i + 1) &&
                str.charCodeAt(i + 1) + 1 === str.charCodeAt(i + 2)
              ) {
                return true;
              }
            }
            return false;
          };
          return !hasSequential(value);
        },
      )
      .required("Password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validationSchema: formSchema,
    onSubmit: submitform,
    validateOnChange: false,
    validateOnBlur: false,
  });

  async function submitform(values) {
    const token = window.location.pathname.split("/").pop();
    try {
      const response = await fetch(`${apiUrl}/api/reset/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setResMessage(data.message);
    } catch (err) {
      // Handle network or unexpected errors
      setResMessage("An unexpected error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  }

  const displayErrors = (error) => {
    return error ? <p style={{ color: "red" }}>{error}</p> : null;
  };

  return (
    <div className="formbody">
      <form onSubmit={formik.handleSubmit}>
        <h2>Reset Password</h2>

        <div className="container">
          <p>
            Password need to be 8-12 characters. Must include a mix of uppercase
            letters (A-Z), lowercase letters (a-z), Numbers (0-9), special
            characters (!, @, #, $, %). No repeating (a,a,a) or sequential
            characters (1,2,3) allowed.{" "}
          </p>

          <label htmlFor="password">
            <strong>New Password </strong>
          </label>
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            autoComplete="new-password"
          />
          {displayErrors(formik.errors.password)}

          <label htmlFor="confirmpassword">
            <strong>Confirm New Password </strong>
          </label>
          <input
            type="password"
            id="confirmpassword"
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            autoComplete="new-password"
          />
          {displayErrors(formik.errors.confirmpassword)}
        </div>
        {resMessage && displayErrors(resMessage)}
        <button type="submit">Reset Password</button>
        <p>
          Return to{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
