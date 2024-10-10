import React, { useState, useContext } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser, login } = useContext(UserContext)
  const navigate = useNavigate()

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Please provide a valid email"),
    name: yup
      .string()
      .min(3)
      .required(),
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
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: formSchema,
    onSubmit: submitform,
    validateOnChange: false,
    validateOnBlur: false
  });

  async function submitform(values) {
    try {
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      // Parse the response data for successful signup
      const data = await response.json();
      setErrorMessage(""); // Clear any previous errors
      login(data);
      navigate('/')
      alert('Thanks for signing up!')


    } catch (err) {
      // Handle errors, either from the response or network issues
      setErrorMessage(err.message || "An unexpected error occurred");
      console.error("Signup error:", err);
    }
  }

  const displayErrors = (error) => {
    return error ? <p style={{ color: "red" }}>{error}</p> : null;
  };
  
  return (
    <div className="formbody">
      <form onSubmit={formik.handleSubmit}>
        <h2>Signup</h2>

        <div className="container">
          <label htmlFor="email">
            <strong>Email </strong>
          </label>
          <input
            type="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {displayErrors(formik.errors.email)}

          <label htmlFor="name">
            <strong>Username (case-sensitive) </strong>
          </label>
          <input
            type="text"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {displayErrors(formik.errors.name)}

          <p>
            Password need to be 8-12 characters. Must include a mix of uppercase
            letters (A-Z), lowercase letters (a-z), Numbers (0-9), special
            characters (!, @, #, $, %). No repeating (a,a,a) or sequential
            characters (1,2,3) allowed.{" "}
          </p>

          <label htmlFor="password">
            <strong>Password </strong>
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
            <strong>Password Confirmation </strong>
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
        <button type="submit">Sign Up</button>
        {displayErrors(errorMessage)}
      </form>
    </div>
  );
};
export default Signup;
