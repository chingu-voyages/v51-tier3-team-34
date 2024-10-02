import React, {useState} from 'react'
import * as yup from 'yup'
import {useFormik} from 'formik'

const apiUrl = 
import.meta.env.MODE === "development"
	? "http://localhost:8080"
	: import.meta.env.VITE_BACKEND_URL


const Signup = () => {
	const [ errorMessage, setErrorMessage ] = useState("")

	const formSchema = yup.object().shape({
		email: yup.string().required("Email is required").email("Please provide a valid email"),
		password: yup.string()
			.min(8, 'Password must be at least 8 characters long')
			.max(12, 'Password cannot be more than 12 characters long')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.matches(/\d/, 'Password must contain at least one number')
			.matches(/[\W_]/, 'Password must contain at least one special character')
			.test('no-repeating', 'Password cannot contain repeating characters', (value) => {
				return !(/(.)\1\1/.test(value)); // checks for repeating characters
			})
			.test('no-sequential', 'Password cannot contain sequential characters', (value) => {
				const hasSequential = (str) => {
					for (let i = 0; i < str.length - 2; i++) {
						if (str.charCodeAt(i) + 1 === str.charCodeAt(i + 1) && str.charCodeAt(i + 1) + 1 === str.charCodeAt(i + 2)) {
							return true;
						}
					}
				return false;
				};
				return !hasSequential(value);
			})
		.required('Password is required'),
		confirmpassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			confirmpassword: "",
		},
		validationSchema: formSchema,
		onSubmit: submitform
})


async function submitform(values) {
  console.log(values);

  try {
    const response = await fetch(`${apiUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
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
    setErrorMessage("");  // Clear any previous errors
    console.log("Signup successful", data);
    // Handle signup success, like redirecting or showing success message

  } catch (err) {
    // Handle errors, either from the response or network issues
    setErrorMessage(err.message || "An unexpected error occurred");
    console.error("Signup error:", err);
  }
}

const displayErrors =(error) => {
		return error ? <p style={{color: "red"}}>{error}</p> : null
}
  return (
		<div className='formbody'>
    <form onSubmit={formik.handleSubmit}>
    	<h2>Signup</h2>

      <div className='container'>
				<label htmlFor="email"><strong>Email </strong></label>
        <input type="email" id="email" value={formik.values.email} onChange={formik.handleChange} />
        {displayErrors(formik.errors.email)}

				<p>Password need to be 8-12 characters. Must include a mix of uppercase letters (A-Z), 
					lowercase letters (a-z), Numbers (0-9), special characters (!, @, #, $, %). No repeating (a,a,a)
					or sequential characters (1,2,3) allowed. </p>

        <label htmlFor="password"><strong>Password </strong></label>
        <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} autoComplete='new-password'/>
        {displayErrors(formik.errors.password)}

        <label htmlFor="confirmpassword"><strong>Password Confirmation </strong></label>
        <input type="password" id='confirmpassword' value={formik.values.confirmpassword} onChange={formik.handleChange} autoComplete='new-password'/>
        {displayErrors(formik.errors.confirmpassword)}
      </div>
      <button type="submit">Sign Up</button>
      {displayErrors(errorMessage)}  
    </form>
    </div>
  )
}
export default Signup
