import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e?.preventDefault(); // prevent crash when called without event

    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle paste
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || "";
      }
      setCode(newCode);

      const next = newCode.findIndex((d) => d === "");
      inputRefs.current[next === -1 ? 5 : next].focus();
      return;
    }

    // Normal typing
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(); // no event passed → safe now
    }
  }, [code]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          Email Verification
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Didn’t receive a code?
            <Link className="text-indigo-600 font-medium hover:underline">
              Resend Code
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
