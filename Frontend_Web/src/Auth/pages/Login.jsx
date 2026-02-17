// src/Auth/pages/Login.jsx
import { Eye, EyeOff } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginGoogle } from "../components/LoginGoogle";



export const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const containerRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setButtonWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      login.mutate(value);
    },
  });

  const handleGoogleSuccess = (credentialResponse) => {
    googleLogin.mutate(credentialResponse.credential);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">
            Login to your account
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >

          {/* USERNAME */}
          <form.Field
            name="username"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                />
              </div>
            )}
          />

          {/* PASSWORD */}
          <form.Field
            name="password"
            children={(field) => (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-black">
                    Password
                  </label>
                  <Link
                    to="/recuperar-password"
                    className="text-sm text-black hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {login.isPending ? "Loading..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-gray-500 text-sm">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* SOCIALS */}
          <div className="w-full" ref={containerRef}>
            <LoginGoogle onSuccess={handleGoogleSuccess} width={buttonWidth} />
          </div>

          {/* SIGN UP */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/registro"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;