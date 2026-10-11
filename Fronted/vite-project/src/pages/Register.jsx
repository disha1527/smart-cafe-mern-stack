



import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/^[A-Z]/.test(password)) {
      return "Password must start with an uppercase letter.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character/symbol.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("All fields are required");
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    const response = await fetch(
      "http://https://smart-cafe-mern-stack.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();

    if (response.ok) {
      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;

      localStorage.setItem("token", token);
      login(user);

      navigate("/login");
    } else {
      toast.error(data.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3] px-6">

      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            alt="coffee"
            className="h-full w-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="p-10">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Join our Smart Cafe community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
              onChange={handleChange}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              className="w-full bg-[#7B3F00] text-white py-3 rounded-lg
              hover:bg-[#5a2e00] transition duration-300"
            >
              Register
            </button>

          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#7B3F00] font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;