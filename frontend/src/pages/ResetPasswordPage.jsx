import React, { useState, useEffect } from "react";
import { Lock, CheckCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, isLoading, error } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset token");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You can now login with your new password.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
          >
            Go to Login
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to login page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}

          {password && password.length < 6 && (
            <p className="text-yellow-500 text-sm">
              Password must be at least 6 characters
            </p>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword || password.length < 6}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

