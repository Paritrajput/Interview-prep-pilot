const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

//require all the routes here

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Agar request localhost se hai, ya fir Vercel ke kisi bhi domain se hai, toh allow karo
        if (!origin || origin === "http://localhost:5173" || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

const authRouter = require('./routes/auth.routes');
const interviewRouter = require("./routes/interview.routes");

//using all the routes here 
app.use('/api/auth', authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;

