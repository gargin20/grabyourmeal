import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import {useSelector} from "react-redux"

import Home from "./pages/Home"
export const serverurl="http://localhost:8000"
function App() {
  useGetCurrentUser()
  const {userData}= useSelector(state=>state.user)
  return (
    <Routes>
      <Route path="/signup" element={!userData?<SignUp />:<Navigate to={"/"}/> }/>
      <Route path="/signin" element={!userData?<SignIn />:<Navigate to={"/"}/>} />
      <Route path="/forgot-password" element={userData?<ForgotPassword />:<Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home />:<Navigate to={"/signin"}/>} />
    </Routes>
  );
}

export default App;