import { useContext, useEffect} from "react";
import {AuthContext} from "../auth.context";
import {login, register, logout, getMe} from "../services/auth.api";

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context
    
    const handleLogin = async ({email, password})=>{
        setLoading(true)
        try{
            const data = await login({email, password})
            // console.log("Backend login data:", data); // Add this to see what your backend sends
            
            // If your backend returns the user directly, you might need to use setUser(data) instead of setUser(data.user)
            setUser(data.user ? data.user : data);
        }
        catch(err){
            console.error("Auth Hook Login Error:", err);
            throw err;
        }
        finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true)
        try{
        const data = await register({username, email, password})
        setUser(data.user ? data.user : data);
        }
        catch(err){
            console.error("Auth Hook Register Error:", err);
            throw err;
        }finally{
        setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            const data = await logout()
           setUser(null)
        }catch(err){
            console.error("Auth Hook Logout Error:", err);
            throw err; // CRITICAL
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            try{
                const data = await getMe()
                setUser(data.user)
            }catch(err){ }finally{
                setLoading(false);
            }
        }
        getAndSetUser()
    }, [])

    return {user, loading, handleLogin, handleRegister, handleLogout}
}