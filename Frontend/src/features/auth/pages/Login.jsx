
import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'; // Using react-router-dom is standard
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast'; // ✅ 1. Toast ko import kiya

function Login() {
    const {loading, handleLogin} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        // ✅ 2. Jaise hi form submit ho, ek loading notification dikhayein
        const toastId = toast.loading("Logging in...");

        try {
            await handleLogin({email, password});
            
            // ✅ 3. Agar login successful ho gaya, toh loading wale toast ko 'success' mein badal dein
            toast.success("Login successful!", { id: toastId });
            navigate("/");
            
        } catch (error) {
            // ✅ 4. Agar error aaya, toh usko 'error' wale toast mein badal dein
            // Humara API helper seedha clean message bhej raha hai, toh 'error.message' use karein
            toast.error(error.message || "Login failed. Please try again.", { id: toastId });
        }
    }

    if(loading){
        return (<main><h1>Loading.....</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>(setEmail(e.target.value))}
                    type="email" id="email" name="email" required placeholder="Enter your email" />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => (setPassword(e.target.value))}
                    type="password" id="password" name="password" required placeholder="Enter your password" />
                </div>

                <button className='button primary-button' type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
    </main>
  )
}

export default Login