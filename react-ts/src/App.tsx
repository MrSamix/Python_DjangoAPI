import "./App.css";
import Navbar from "./components/Navbar/navbar";
import { Routes, Route } from "react-router";
import IndexPage from "./pages";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import ProfilePage from "./pages/auth/profile";
import ResetPassword from "./pages/auth/reset-password";
import ForgotPassword from "./pages/auth/forgot-password";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/profile" element={<ProfilePage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
