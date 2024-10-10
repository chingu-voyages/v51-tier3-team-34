import React from 'react'
import * as yup from "yup";
import { useFormik } from "formik";

const ForgotPassword = () => {
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

	function submitform(values) {

	}

	const displayErrors = (error) => {
    return error ? <p style={{ color: "red" }}>{error}</p> : null;
  };

  return (
		<div className="formbody">
		<form onSubmit={formik.handleSubmit}>
			<h2>Forgot Password</h2>
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
			</div>
			<button type="submit">Send Link Request</button>
		</form>
		</div>
  )
}

export default ForgotPassword
