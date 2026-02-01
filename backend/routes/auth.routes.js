import express from "express"
import {signUp,signIn,signOut} from "../controllers/auth.controllers.js"
import {sendOtp,verifyOtp,resetPassword,googleAuth} from "../controllers/auth.controllers.js"
const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetpassword",resetPassword)
authRouter.post("/googleauth",googleAuth)
export default authRouter