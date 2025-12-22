import './App.css'
import Navbar from './components/Navbar/navbar'
import { Routes, Route } from 'react-router'
import IndexPage from './pages'
import RegisterPage from './pages/auth/register'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<IndexPage />}/>
        <Route path="/auth/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
