import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout, adminToken, adminLogout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ added

  // The storage sync listener has been removed to allow independent Admin and User tabs.

  // ✅ USER LOGOUT
  const handleLogout = () => {
    logout(); // context clear
    localStorage.removeItem("token"); // remove token
    navigate("/"); // redirect home
  };

  // ✅ ADMIN LOGOUT
  const handleAdminLogout = () => {
    adminLogout(); // context clear
    localStorage.removeItem("adminToken"); // remove admin token
    navigate("/"); // redirect home
  };

  const linkBase =
    "relative px-3 py-2 text-gray-700 hover:text-[#6F4E37] transition";

  const activeLink =
    "text-[#6F4E37] font-semibold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#6F4E37]";

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6F4E37] flex items-center justify-center shadow">
            <span className="text-white text-sm font-bold">QC</span>
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-[#2C2C2C]">QuickCafe</h1>
            <p className="text-xs text-gray-500">Reservation System</p>
          </div>
        </div>

        {/* MOBILE BTN */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          ☰
        </button>

        {/* MENU */}
        <div
          className={`md:flex gap-6 absolute md:static w-full md:w-auto bg-white md:bg-transparent left-0 px-6 md:px-0 transition ${
            open ? "top-16 py-6" : "top-[-400px]"
          }`}
        >
          {/* 👤 GUEST */}
          {!user && !adminToken && (
            <>
              <NavLink
                to="/guest"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Guest
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Contact
              </NavLink>

              <NavLink to="/login" className={linkBase}>
                User Login
              </NavLink>
            </>
          )}

          {/* 🧑 USER */}
          {user && !adminToken && (
            <>
              <NavLink to="/" className={linkBase}>
                Home
              </NavLink>
              <NavLink to="/menu" className={linkBase}>
                Menu
              </NavLink>
              <NavLink to="/booking" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                Booking
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ""}`}>
                Contact
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-[#7B3F00] text-white px-4 py-2 rounded-lg hover:bg-[#7B3F01]"
              >
                Logout
              </button>
            </>
          )}

          {/* 👑 ADMIN */}
          {adminToken && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/menu"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/admin/add-product"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Add Product
              </NavLink>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Bookings
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeLink : ""}`
                }
              >
                Orders
              </NavLink>
              <button
                onClick={handleAdminLogout}
                className="bg-[#7B3F00] text-white px-4 py-2 rounded-lg hover:bg-[#7B3F01] ml-3"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
