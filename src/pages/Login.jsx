import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AppContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { url, setUser, checkAuth } = useAuth();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Normal Login
  const handleNormalLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(
        `${url}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );
      checkAuth();
    } catch (error) {
      console.error(
        "Login Failed:",
        error.response?.data?.message || error.message
      );
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${url}/api/v1/google-login`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      const { user } = res.data;
      setUser(user);
    } catch (error) {
      console.error(
        "Google Login Failed:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Google login failed.");
    }
  };

  // Handle Google Login Failure
  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    alert("Google login failed. Please try again.");
  };

  // Handle Forgot Password Request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${url}/api/v1/forgetPassword`, { email });
      alert("Password reset email sent. Check your inbox.");
      setIsForgotPasswordOpen(false);
      setEmail("");
    } catch (error) {
      console.error(
        "Forgot Password Failed:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Normal Login Form */}
        <form className="space-y-4" onSubmit={handleNormalLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p
          className="text-center mt-3 text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsForgotPasswordOpen(true)}
        >
          Forgot Password?
        </p>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">
              Reset Password
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button
              className="w-full text-center mt-4 text-gray-500 hover:underline"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
