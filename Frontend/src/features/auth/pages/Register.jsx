


import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'; // react-router-dom use karna standard hai
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast'; // ✅ 1. Toast import kiya

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");

    const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) =>{
        e.preventDefault();
        
        // ✅ 2. Form submit hote hi loading toast dikhayein
        const toastId = toast.loading("Creating your account...");

        try {
            await handleRegister({username, email, password});
            
            // ✅ 3. Success par green toast dikhayein aur navigate karein
            toast.success("Registration successful!", { id: toastId });
            navigate("/");
            
        } catch (error) {
            // ✅ 4. Error aane par laal toast dikhayein aur user ko wahi rokein
            toast.error(error.message || "Registration failed. Please try again.", { id: toastId });
        }
    }

    if(loading){
        return (<main><h1>Loading....</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="text" /* 'username' valid type nahi hota, 'text' hona chahiye */
                    id="username" name="username" required placeholder="Enter your username" />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email" id="email" name="email" required placeholder="Enter your email" />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" required placeholder="Enter your password" />
                </div>

                <button className='button primary-button' type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register