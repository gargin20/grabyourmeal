import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../App";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setErr("Email is required");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      await axios.post(
        `${serverurl}/api/auth/sendotp`,
        { email: email.trim().toLowerCase() },
        { withCredentials: true }
      );

      setStep(2);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErr("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      await axios.post(
        `${serverurl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true }
      );

      setStep(3);
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErr("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      await axios.post(
        `${serverurl}/api/auth/resetpassword`,
        { email, newPassword },
        { withCredentials: true }
      );

      navigate("/signin");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/signin")}
          />

          <h1 className="text-2xl font-bold" style={{ color: "#ff4d2d" }}>
            Forgot Password
          </h1>
        </div>

        {step === 1 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>

            <input
              type="email"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleSendOtp}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send OTP"
              )}
            </button>

            {err && <p className="text-red-500 text-sm mt-2">*{err}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              OTP
            </label>

            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleVerifyOtp}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </button>

            {err && <p className="text-red-500 text-sm mt-2">*{err}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>

            <input
              type="password"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleResetPassword}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>

            {err && <p className="text-red-500 text-sm mt-2">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;