import React, { useState } from "react";
import { Mail, User, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input"
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";



export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {signUp,error,isLoading} = useAuthStore();
  

  const handleSignUp = async(e) => {
    e.preventDefault();

    try {
      await signUp(email,password,name);
      navigate("/verify-email")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      
      
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        
        
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Join CarLink — Buy & sell premium cars
        </p>

     
        <form onSubmit={handleSignUp} className="mt-8 space-y-5">
          
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

        
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
            disabled={isLoading}
          >
            {isLoading? <Loader className="animate-spin mx-auto " size={24}/> : "SignUP"}
          </button>

         
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
