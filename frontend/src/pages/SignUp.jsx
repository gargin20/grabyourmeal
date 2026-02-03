import React,{useState} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import{ ClipLoader }from "react-spinners" 
import { setUserData } from "../redux/userSlice";
import {useDispatch} from "react-redux"
function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState("user");
  const Navigate= useNavigate()
  const [fullName, setFullName]= useState("");
  const [email,setEmail]= useState("");
  const [mobile,setMobile]= useState("");
  const [password,setPassword]= useState("");
  const [err,setErr]= useState("");
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch()
  
   const handleSignUp=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signup`,{
                fullName,email,password,mobile,role
            },{withCredentials:true})
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
             setLoading(false)
        }
     }
  const handleGoogleAuth = async () => {
  if (!mobile) {
    alert("Mobile number is required for Google sign up");
    return;
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const { data } = await axios.post(
      `${serverurl}/api/auth/googleauth`,
      {
        fullName: result.user.displayName,
        email: result.user.email,
        mobile,
        role,
      },
      { withCredentials: true }
    );
    dispatch(setUserData(data))
    setErr("");

    
  } catch (error) {
    setErr(error?.response?.data?.message || error.message);
  }
};


  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]" style={{ border: `1px solid ${borderColor}` }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>Vingo</h1>
        <p className='text-gray-600 mb-8'> Create your account to get started with delicious food deliveries</p>
        
        {/* fullName */}
        <div className='mb-4'>
          <label htmlFor="fullName" className='block text-gray-700 font-medium mb-1'>Full Name</label>
          <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Full Name' style={{ border: `1px solid ${borderColor}` }} onChange={(e)=>setFullName(e.target.value)} value={fullName} required/>
        </div>

        {/* email */}
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Email' style={{ border: `1px solid ${borderColor}` }} onChange={(e)=>setEmail(e.target.value)} value={email} required/>
        </div>

        {/* mobile */}
        <div className='mb-4'>
          <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1'>Mobile Number</label>
          <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Mobile Number' style={{ border: `1px solid ${borderColor}` }} onChange={(e)=>setMobile(e.target.value)} value={mobile} required />
        </div>

        {/* password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-orange-500"
            placeholder="Enter your Password"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e)=>setPassword(e.target.value)}
            value={password} required
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* role selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                className={`block w-full text-left px-3 py-2 rounded-lg mb-2 cursor-pointer transition-colors ${
                  role === r
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 bg-orange-500 text-white hover:bg-orange-600 cursor-pointer" onClick={handleSignUp} disable={loading}>
          {loading?<ClipLoader size={20} color-white />: "Sign Up"}
        </button>
        {err && <p className="text-red-500 text-sm mt-2">*{err}</p>}
        <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer" onClick={handleGoogleAuth}>
            <FcGoogle size={20} />
            <span>Sign Up With Google</span>
        </button>
        <p className="text-center mt-6 cursor-pointer" onClick={()=> Navigate("/signin")} >Already have an account? <span className="text-orange-500 cursor-pointer">Sign In</span></p>
      </div>
      
    </div>
  );
}

export default SignUp;