import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input
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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields required");
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://https://smart-cafe-mern-stack.onrender.com/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Admin Registered Successfully ✅");
        navigate("/admin/login");
      } else {
        toast.error(data.message || "Registration Failed");
      }

    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d6ccc2] flex items-center justify-center px-4">

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            alt="cafe"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 bg-[#f8f5f2]">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Join Smart Cafe Admin Panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
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
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B4513] text-white py-3 rounded-lg
              hover:bg-[#6f360f] transition duration-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-[#8B4513] font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminRegister;