


import axios from "axios";

// 1. Base URL aur Axios Instance set kiya
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: `${backendUrl}/api/auth`, 
    withCredentials: true 
});

export default api;

// ====================================================================
// 🛠 HELPER FUNCTION: Error message nikalne ke liye
// Yeh function backend se bheja gaya exact error message nikalega
// ====================================================================
const getErrorMessage = (err) => {
    // Agar backend ne specific error bheja hai (jaise res.status(400).json({message: "..."}))
    if (err.response && err.response.data && err.response.data.message) {
        return err.response.data.message;
    }
    // Agar server completely down hai ya internet nahi hai
    return err.message || "Something went wrong. Please try again.";
};


// ====================================================================
// 🚀 API CALLS
// ====================================================================

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/register', { username, email, password });
        return response.data;
    } catch (err) {
        const exactError = getErrorMessage(err);
        console.error("Registration error:", exactError);
        
        // Error ko wapas React component ko bhej rahe hain taaki wahan alert/toast dikha sakein
        throw new Error(exactError); 
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (err) {
        const exactError = getErrorMessage(err);
        console.error("Login error:", exactError);
        throw new Error(exactError);
    }
}

export async function logout() {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (err) {
        const exactError = getErrorMessage(err);
        console.error("Logout error:", exactError);
        throw new Error(exactError);
    }
}

export async function getMe() {
    try {
        const response = await api.get('/get-me');
        return response.data;
    } catch (err) {
        const exactError = getErrorMessage(err);
        // getMe usually background me chalta hai, isliye iska console.error chupa sakte hain
        // console.error("GetMe error:", exactError); 
        throw new Error(exactError); 
    }
}

