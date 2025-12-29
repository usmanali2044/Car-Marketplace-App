import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login,isLoading,error} = useAuthStore()
  const navigate = useNavigate();


  const handleLogin =async (e) => {
    e.preventDefault();
    await login(email,password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      
      
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        
     
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          Login
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Access your CarLink account
        </p>

       
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          
          <Input
            icon={Mail}
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          
          <div className="text-right">
            <Link to={""} className="text-sm text-indigo-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>

      
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
