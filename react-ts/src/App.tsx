import "./App.css";
import Navbar from "./components/Navbar/navbar";
import { Routes, Route } from "react-router";
import IndexPage from "./pages";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import ProfilePage from "./pages/auth/profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
