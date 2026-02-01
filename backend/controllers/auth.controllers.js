import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.utils.js"
import sendOtpMail from "../utils/mail.js";

// ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body

    // Validate required fields
    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Validate mobile number length
    if (String(mobile).length !== 10) {
      return res.status(400).json({ message: "Invalid mobile number" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role
    })

    // Generate token
    const token = await genToken(newUser._id)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Send response
    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      },
      token
    })

  } catch (err) {
    console.error("SIGNUP ERROR:", err)
    return res.status(500).json({ message: "internal server error" })
  }
}

// ================= SIGN IN =================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "User signed in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      },
      token
    })

  } catch (err) {
    console.error("SIGNIN ERROR:", err)
    return res.status(500).json({ message: "internal server error" })
  }
}

// ================= SIGN OUT =================
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "User signed out successfully" })
  } catch (err) {
    return res.status(500).json({ message: "internal server error" })
  }
}

export const sendOtp =async(req,res)=>{
  try{
    const {email}= req.body
    const user= await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"User does not exist"})
    }
    const otp= Math.floor(1000 + Math.random() * 9000).toString()
    user.resetOtp=otp
    user.otpExpires=Date.now()+5*60*1000
    user.isotpVerified=false
    await user.save()
    await sendOtpMail(user.email,otp)
    return res.status(200).json({message:"OTP sent to your email"})
  }
  catch(error){
    console.error("SEND OTP ERROR:",error)
  }
}

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body
    email = email.trim().toLowerCase()
    otp = otp.trim()

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    if (String(user.resetOtp) !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    user.isotpVerified = true
    user.resetOtp = null
    user.otpExpires = null
    await user.save()

    return res.status(200).json({ message: "OTP verified successfully" })
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const resetPassword= async(req,res)=>{
  try{
    const {email,newPassword}= req.body
    const user  = await User.findOne({email})
    if(!user || !user.isotpVerified){
      return res.status(400).json({message:"User does not exist or OTP not verified"})
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password=hashedPassword
    user.resetOtp=null
    user.otpExpires=null
    user.isotpVerified=false
    await user.save()
    return res.status(200).json({message:"Password reset successfully"})
  }
  catch(error){
    console.error("RESET PASSWORD ERROR:",error)
  }
}

export const googleAuth= async(req,res)=>{
  try{
    const {email,fullName,mobile,role}= req.body
    let user= await User.findOne({email}) 
    if(!user){
      user= await User.create({
        fullName,
        email,
        mobile,
        role

      })
    }
    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "User signed in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      },
      token
    })

  }
  catch(error){
    console.error("SIGNIN ERROR:", error)
    return res.status(500).json({ message: "internal server error" })

  }
}


  