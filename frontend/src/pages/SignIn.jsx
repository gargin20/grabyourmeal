import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch} from "react-redux";
import { setUserData
 } from "../redux/userSlice";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch= useDispatch()
  const handleSignIn = async () => {
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const result = await axios.post(
        `${serverurl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data))
    } catch (error) {
      setErr(error.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErr("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await axios.post(
        `${serverurl}/api/auth/googleauth`,
        { email: result.user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Grab Your Meal
        </h1>
        <p className="text-gray-600 mb-8">
          Sign In to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded-lg px-3 py-2 pr-10"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px]"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div
          className="text-right mb-4 text-orange-500 cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </div>

        {/* Sign In Button */}
        <button
          className="w-full mt-4 flex items-center justify-center rounded-lg px-4 py-2 bg-orange-500 text-white disabled:opacity-70"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
        </button>

        {err && <p className="text-red-500 text-sm mt-2">*{err}</p>}

        {/* Google */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-gray-100"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span>Sign In With Google</span>
        </button>

        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Create new account{" "}
          <span className="text-orange-500">Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;