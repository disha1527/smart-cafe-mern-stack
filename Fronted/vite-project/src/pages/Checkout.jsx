


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaCreditCard, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Prevent users from checking out with an empty cart
  useEffect(() => {
    const checkCart = async () => {
      const res = await fetch("https://smart-cafe-mern-stack.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data || data.length === 0) {
        toast.error("Your cart is empty. Please add items first.");
        navigate("/menu");
      }
    };
    checkCart();
  }, [navigate, token]);

  // Fetch user profile to prefill the contact details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://smart-cafe-mern-stack.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.error("Error fetching user profile info:", error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleCOD = async () => {
    const res = await fetch("https://smart-cafe-mern-stack.onrender.com/api/orders/cod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address,
        deliveryName: name,
        deliveryPhone: phone,
        deliveryEmail: email
      }),
    });

    if (res.ok) {
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.message || "Order Failed");
    }
  };

  const handleStripe = async () => {
    localStorage.setItem("deliveryAddress", address);
    localStorage.setItem("deliveryName", name);
    localStorage.setItem("deliveryPhone", phone);
    localStorage.setItem("deliveryEmail", email);

    const res = await fetch(
      "https://smart-cafe-mern-stack.onrender.com/api/payment/online",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => ({}));

    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.message || "Payment session failed");
    }
  };

  const handleSubmit = () => {
    const nameStr = name.trim();
    const phoneStr = phone.trim();
    const emailStr = email.trim();
    const addressStr = address.trim();

    if (!nameStr) {
      toast.error("Please enter delivery name");
      return;
    }
    if (nameStr.length < 3) {
      toast.error("Name must be at least 3 characters long");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(nameStr)) {
      toast.error("Name must contain only letters and spaces");
      return;
    }

    if (!phoneStr) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!/^\d{10}$/.test(phoneStr)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!emailStr) {
      toast.error("Please enter your email ID");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!addressStr) {
      toast.error("Please enter your delivery address");
      return;
    }
    if (addressStr.length < 15) {
      toast.error("Please enter a complete address (minimum 15 characters)");
      return;
    }
    if (addressStr.split(/\s+/).length < 3) {
      toast.error("Please provide a detailed address (Street, Area/Landmark, City)");
      return;
    }

    if (paymentMethod === "COD") {
      handleCOD();
    } else {
      handleStripe();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5ECE3] pt-24 px-6 pb-12">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Checkout
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Complete your order and enjoy your coffee ☕
        </p>

        {/* Name Input */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FaUser className="text-gray-500" /> Delivery Name
          </label>
          <input
            type="text"
            placeholder="Enter delivery recipient's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FaPhoneAlt className="text-gray-500" /> Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FaEnvelope className="text-gray-500" /> Email ID
          </label>
          <input
            type="email"
            placeholder="Enter email address for updates"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FaMapMarkerAlt className="text-gray-500" /> Delivery Address
          </label>
          <textarea
            rows="3"
            placeholder="Enter your complete delivery address (Street, Area/Landmark, City, Pincode)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00] resize-none"
          ></textarea>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <label className="text-gray-700 font-semibold mb-3 block">
            Payment Method
          </label>

          <div className="space-y-3">
            {/* COD */}
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaMoneyBillWave className="text-green-600" />
              <span>Cash on Delivery</span>
            </label>

            {/* Stripe */}
            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <FaCreditCard className="text-blue-600" />
              <span>Online Payment (Card / Stripe)</span>
            </label>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#7B3F00] text-white py-3 rounded-full text-lg hover:bg-[#5a2e00] transition"
        >
          Pay & Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;