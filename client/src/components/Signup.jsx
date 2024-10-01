import React from 'react'
import * as yup from 'yup'
import {useFormik} from 'formik'


const Signup = () => {
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

// const checkBackendErrors = (data) => {
// 		if (data.error) {
// 				setError(data.error)
// 		} else {
// 				login(data)
// 				navigate("/")
// 		}
// }

function submitform(values) {
	console.log(values)
// 		setError(null)
		
// 		fetch("/api/signup", {
// 				method: "POST",
// 				headers: {
// 						"Content-Type" : "application/json",
// 						"Accept" : "application/json"
// 				},
// 				body: JSON.stringify(values)
// 		})
// 		.then(resp => resp.json())
// 		.then(data => {
// 				checkBackendErrors(data)
// 		})

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

        <label htmlFor="password"><strong>Password </strong></label>
        <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} autoComplete='new-password'/>
        {displayErrors(formik.errors.password)}

        <label htmlFor="confirmpassword"><strong>Password Confirmation </strong></label>
        <input type="password" id='confirmpassword' value={formik.values.confirmpassword} onChange={formik.handleChange} autoComplete='new-password'/>
        {displayErrors(formik.errors.confirmpassword)}
      </div>
        
      <button type="submit">Sign Up</button>
    </form>
    </div>
  )
}
export default Signup
