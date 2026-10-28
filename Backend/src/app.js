const express=require('express');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const mongoose=require('mongoose')

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials:true
}))

app.get("/api/health", (_req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1
    const aiConfigured = Boolean(process.env.GOOGLE_GENAI_API_KEY)
    const authConfigured = Boolean(process.env.JWT_SECRET)
    const ready = databaseConnected && aiConfigured && authConfigured
    res.status(ready ? 200 : 503).json({
        status: ready ? "ok" : "unavailable",
        database: databaseConnected ? "connected" : "disconnected",
        ai: aiConfigured ? "configured" : "missing configuration",
        authentication: authConfigured ? "configured" : "missing configuration"
    })
})

const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

module.exports=app;