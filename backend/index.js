import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/db.js"
dotenv.config()
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouterRouter)

app.listen(port, () => {
    connectdb()
    console.log(`server started at ${port}`)
})