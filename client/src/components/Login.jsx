import React, { useState, useContext } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { UserContext } from "../context/UserContext";

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      // .min(8, 'Password must be at least 8 characters long')
      // .max(12, 'Password cannot be more than 12 characters long')
      // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .matches(/\d/, 'Password must contain at least one number')
      // .matches(/[\W_]/, 'Password must contain at least one special character')
      // .test('no-repeating', 'Password cannot contain repeating characters', (value) => {
      // 	return !(/(.)\1\1/.test(value)); // checks for repeating characters
      // })
      // .test('no-sequential', 'Password cannot contain sequential characters', (value) => {
      // 	const hasSequential = (str) => {
      // 		for (let i = 0; i < str.length - 2; i++) {
      // 			if (str.charCodeAt(i) + 1 === str.charCodeAt(i + 1) && str.charCodeAt(i + 1) + 1 === str.charCodeAt(i + 2)) {
      // 				return true;
      // 			}
      // 		}
      // 		return false;
      // 	};
      // 	return !hasSequential(value);
      // })
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: submitform,
    validateOnChange: false,
    validateOnBlur: false,
  });

  async function submitform(values) {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage(""); // Clear previous error message if login is successful
        login(data);
        navigate("/");
      } else {
        // Attempt to extract the error message from the response body
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed"); // Default error message if none provided
      }
    } catch (err) {
      // Handle network or unexpected errors
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  }

  const displayErrors = (error) => {
    return error ? <p style={{ color: "red" }}>{error}</p> : null;
  };

  return (
    <div className="formbody">
      <form onSubmit={formik.handleSubmit}>
        <h2>Login</h2>
        <div className="container">
          <label htmlFor="email">
            <strong>Email </strong>
          </label>
          <input
            type="text"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {displayErrors(formik.errors.email)}

          <label htmlFor="password">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            autoComplete="new-password"
          />
          {displayErrors(formik.errors.password)}
        </div>

        <button type="submit">Log In</button>
        {displayErrors(errorMessage)}

        <p>
          Not a current user?{" "}
          <span>
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
        <hr style={{ border: "1px dashed #933a05", width: "50%" }} />
        <p>
          Forgot password?{" "}
          <span>
            <Link to="/reset">Reset Password</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
