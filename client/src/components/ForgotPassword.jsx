import { useState } from 'react'
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
	const [resMessage, setResMessage] = useState("")

	const formSchema = yup.object().shape({
    email: yup.string().email().required("Email is required")
	})

	const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: formSchema,
    onSubmit: submitform,
    validateOnChange: false,
    validateOnBlur: false
  });

	async function submitform(values) {
		try {
      const response = await fetch(`${apiUrl}/api/reset`, {
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
			<h2>Reset Your Password</h2>
			<div className="container">
				<label htmlFor="email">
					<p>Please enter the email address you would like password reset information be sent to.</p>
					<strong>Email </strong>
				</label>
				<input
					type="text"
					id="email"
					value={formik.values.email}
					onChange={formik.handleChange}
				/>
				{displayErrors(formik.errors.email)}
				{resMessage && displayErrors(resMessage)}
			</div>
			<button type="submit">Request Reset Link</button>
			<p>Return to <span><Link to="/login">Login</Link></span></p>
		</form>
		</div>
  )
}

export default ForgotPassword
