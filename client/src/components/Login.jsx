import React from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Link } from "react-router-dom";
import "../styles/login.css"

const Login = () => {
	const formSchema = yup.object().shape({
		email: yup.string().email().required("Email is required"),
		password: yup.string().required("Password is required").min(8).max(12),
	});

	const formik = useFormik({
		initialValues: {
				email: "",
				password: "",
		},
		validationSchema: formSchema,
		onSubmit: submitform
	})

  function submitform(values) {
		console.log(values)
      // fetch("/api/login", {
      //     method: "POST",
      //     headers: {
      //         "Content-Type" : "application/json",
      //         "Accept" : "application/json"
      //     },
      //     body: JSON.stringify(values),
      // })
      // .then((resp) => {
      //   if (resp.ok) {
      //       resp.json().then((data) => {
      //           login(data)
      //       })
      //   } else {
      //       resp.json().then((err)=>setError(err.error))
      //   }
      // })
  }

  const displayErrors =(error) => {
      return error ? <p style={{color: "red"}}>{error}</p> : null
  }

  return (
		<div className='formbody'>
    	<form onSubmit={formik.handleSubmit}>
        <h2>Login</h2>
        	<div className='container'>
          	<label htmlFor='email'><strong>Email </strong></label>
            <input type="text" id="email" value={formik.values.email} onChange={formik.handleChange}/>
            {displayErrors(formik.errors.email)}

          	<label htmlFor="password"><strong>Password</strong></label>
            <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} autoComplete='new-password'/>
            {displayErrors(formik.errors.password)}
        	</div>

					<button type="submit">Log In</button>
        	{/* {displayErrors(error)} */}
  
					<p>Not a current user? <Link to="/signup">Sign Up</Link></p>
    	</form>
    </div>
  )
}

export default Login
