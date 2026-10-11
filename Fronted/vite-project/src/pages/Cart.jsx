
// export default Cart;






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaStar } from "react-icons/fa";

function Cart() {

  const getProductImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/150";

    if (image.startsWith("http")) return image;

    if (image.startsWith("/uploads/")) {
      return `http://https://smart-cafe-mern-stack.onrender.com${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `http://https://smart-cafe-mern-stack.onrender.com/${image}`;
    }

    return `http://https://smart-cafe-mern-stack.onrender.com/uploads/${image.replace(/^\/+/, "")}`;
  };

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch Cart (OUTSIDE useEffect)
  const fetchCart = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch("http://https://smart-cafe-mern-stack.onrender.com/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Quantity Update (UI only for now)
  const updateQty = (index, type) => {

    const updatedCart = [...cart];

    if (type === "inc") updatedCart[index].quantity += 1;
    if (type === "dec" && updatedCart[index].quantity > 1)
      updatedCart[index].quantity -= 1;

    setCart(updatedCart);
  };

  // ✅ REMOVE ITEM (API CALL)
  const removeItem = async (productId) => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://https://smart-cafe-mern-stack.onrender.com/api/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      fetchCart(); // 🔥 refresh from DB
    } else {
      toast.error("Failed to delete item");
    }
  };

  // Total Price
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] via-[#f7efe5] to-[#f1e3d3] pt-28 px-4 sm:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Your Cart {cart.length > 0 && <span className="text-[#7B3F00] text-3xl font-bold ml-2 opacity-80">({cart.length} items)</span>}
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-3xl p-16 shadow-sm border border-white/50 min-h-[40vh]">
            <div className="w-24 h-24 bg-[#F5ECE3] rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FaShoppingCart className="text-[#7B3F00] opacity-50" size={40} />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Your cart is feeling light</p>
            <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Discover our delicious menu and find your next favorite meal.</p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-[#7B3F00] text-white px-8 py-3.5 rounded-full hover:bg-[#5a2e00] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold flex items-center gap-2"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Cart Items */}
            <div className="flex-1 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white/90 backdrop-blur-lg rounded-[2rem] shadow-sm hover:shadow-[0_12px_30px_rgba(123,63,0,0.08)] transition-all duration-500 p-5 pr-6 flex flex-col sm:flex-row items-center gap-6 border border-white"
                >
                  {/* Product Image */}
                  <div className="relative shrink-0">
                    <img
                      src={getProductImageSrc(item.product.image)}
                      alt={item.product.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-inner"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-1">
                      <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                          {item.product.name}
                        </h2>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-yellow-400">
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} className={item.product.price % 3 === 0 ? "text-yellow-400" : "text-yellow-400 opacity-60"} />
                          </div>
                          <span className="text-xs font-bold text-gray-600 ml-1">
                            {item.product.price % 3 === 0 ? "5.0" : "4.8"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 hover:bg-red-50 rounded-full self-end sm:self-start shrink-0"
                        title="Remove item"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    {item.product.description && (
                      <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 mb-3 pr-4">
                        {item.product.description}
                      </p>
                    )}

                    <div className="mb-4">
                      <span className="inline-block bg-[#F5ECE3] text-[#7B3F00] text-xs font-extrabold px-2.5 py-1 rounded-md border border-[#7B3F00]/20">
                        Size: {item.size || "Regular"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[#7B3F00] font-black text-xl">
                        ₹{item.product.price}
                      </p>

                      {/* Modern Quantity Selector */}
                      <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner border border-gray-200/50">
                        <button
                          onClick={() => updateQty(index, "dec")}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-[#7B3F00] hover:shadow-sm transition-all"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(index, "inc")}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-[#7B3F00] hover:shadow-sm transition-all"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 sticky top-32 border border-white flex flex-col">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Estimated Tax & Fees</span>
                    <span className="font-semibold text-gray-800">₹{Math.round(total * 0.05)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100/80">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black text-[#7B3F00]">
                        ₹{total + Math.round(total * 0.05)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">Inclusive of all taxes</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#7B3F00] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#5a2e00] hover:shadow-[0_8px_20px_rgba(123,63,0,0.3)] hover:-translate-y-1 transition-all duration-300 mt-auto"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
                  🔒 Secure and encrypted checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;