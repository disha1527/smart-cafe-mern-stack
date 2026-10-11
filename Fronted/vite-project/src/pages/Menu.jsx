import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("https://smart-cafe-mern-stack.onrender.com/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Unable to load menu");
          return;
        }

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://smart-cafe-mern-stack.onrender.com/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
        size: selectedSizes[productId] // sending size just in case, even if backend ignores it for now
      }),
    });

    if (res.ok) {
      navigate("/cart");
    }
  };

  const getSizeOptions = (category) => {
    if (!category) return ["Regular", "Large"];
    const cat = category.toLowerCase();

    // Drinks
    if (cat.includes("coffee") || cat.includes("drink") || cat.includes("beverage") || cat.includes("shake") || cat.includes("tea") || cat.includes("cold")) {
      return ["250 ml", "350 ml"];
    }
    // Snacks
    if (cat.includes("snack") || cat.includes("fries") || cat.includes("biscuit") || cat.includes("cookie") || cat.includes("dessert") || cat.includes("cake")) {
      return ["50 gm", "100 gm", "150 gm"];
    }
    // Meals
    if (cat.includes("meal") || cat.includes("pizza") || cat.includes("burger") || cat.includes("sandwich") || cat.includes("pasta")) {
      return ["Half", "Full", "Regular", "Large"];
    }

    return ["1 Portion"];
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const getSmartRating = (item) => {
    if (!item || !item.price) return { rating: 0, count: 0 };
    const baseCount = 80 + (item.price % 100);
    const baseRating = item.price % 3 === 0 ? 5.0 : 4.8;
    const actualCount = item.numReviews || 0;
    const actualRating = item.rating || 0;
    const displayRating = ((baseRating * baseCount) + (actualRating * actualCount)) / (baseCount + actualCount);
    return { rating: displayRating, count: baseCount + actualCount };
  };

  return (
    <div className="bg-[#F9F5F0] min-h-screen pt-24 px-6 md:px-16">
      {/* Title */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-[#7B3F00]">Our Cafe Menu</h1>

        <p className="text-gray-600 mt-3">
          Freshly brewed coffee & delicious food made with love ☕
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-lg">Loading menu...</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20 pt-16">
          {products.map((item) => {
            const smart = getSmartRating(item);
            return (
            <div
              key={item._id}
              className="relative bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(123,63,0,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center mt-12 border-b-4 border-[#7B3F00]"
            >
              {/* Floating Circular Image */}
              <div 
                className="absolute -top-16 w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#F9F5F0] z-10 group cursor-pointer"
                onClick={() => setSelectedProduct(item)}
                title="Click to view full image"
              >
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `https://smart-cafe-mern-stack.onrender.com${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>

              {/* Product Info Section */}
              <div className="mt-16 w-full flex flex-col flex-grow items-center">
                <h2 className="text-xl font-extrabold text-gray-900 mb-1 line-clamp-1 hover:text-[#7B3F00] transition-colors">
                  {item.name}
                </h2>

                {/* Rating Section */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <div className="flex text-yellow-400">
                    <FaStar size={14} className={smart.rating >= 1 ? "text-yellow-400" : "text-gray-300"} />
                    <FaStar size={14} className={smart.rating >= 2 ? "text-yellow-400" : "text-gray-300"} />
                    <FaStar size={14} className={smart.rating >= 3 ? "text-yellow-400" : "text-gray-300"} />
                    <FaStar size={14} className={smart.rating >= 4 ? "text-yellow-400" : "text-gray-300"} />
                    <FaStar size={14} className={smart.rating >= 4.8 ? "text-yellow-400" : "text-gray-300"} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 ml-1">
                    {smart.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({smart.count})
                  </span>
                </div>
                
                {/* Size Dropdown */}
                <div className="mb-3">
                  <select
                    className="bg-[#F5ECE3] text-[#7B3F00] text-xs font-bold px-3 py-1.5 rounded-full border border-[#7B3F00]/20 outline-none cursor-pointer appearance-none pr-7 relative shadow-sm"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237B3F00%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                    value={selectedSizes[item._id] || getSizeOptions(item.category)[0]}
                    onChange={(e) => handleSizeChange(item._id, e.target.value)}
                  >
                    {getSizeOptions(item.category).map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                  {item.description}
                </p>

                {/* Footer: Price and Add Button */}
                <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-gray-100/80">
                  <span className="text-2xl font-black text-[#7B3F00]">
                    ₹{item.price}
                  </span>
                  
                  <button
                    onClick={() => addToCart(item._id)}
                    className="bg-[#7B3F00] text-white flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md hover:bg-[#5a2e00] hover:shadow-lg active:scale-95 transition-all duration-300"
                    title="Add to Cart"
                  >
                    <FaShoppingCart size={16} />
                    <span className="font-semibold text-sm">Add</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedProduct && (() => {
        const modalSmart = getSmartRating(selectedProduct);
        return (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="relative max-w-xl w-full flex flex-col justify-center items-center animate-[zoomIn_0.3s_ease-out]">
            {/* Close button */}
            <button 
              className="absolute -top-14 right-0 md:-right-8 text-white hover:text-[#E8C39E] transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full shadow-lg z-10"
              onClick={() => setSelectedProduct(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full" onClick={(e) => e.stopPropagation()}>
              {/* Force a consistent square/4:3 aspect ratio so all images look the same size */}
              <div className="w-full aspect-[4/3] bg-[#F5ECE3] relative">
                <img 
                  src={selectedProduct.image?.startsWith("http") ? selectedProduct.image : `https://smart-cafe-mern-stack.onrender.com${selectedProduct.image}`} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                {/* Product Name & Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block bg-[#E8C39E] text-[#4a2400] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
                    {selectedProduct.category || "Specialty"}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg leading-tight mb-2">
                    {selectedProduct.name}
                  </h3>
                  
                  {/* Rating Section in Modal */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-yellow-400">
                      <FaStar size={16} className={modalSmart.rating >= 1 ? "text-yellow-400" : "text-gray-300/50"} />
                      <FaStar size={16} className={modalSmart.rating >= 2 ? "text-yellow-400" : "text-gray-300/50"} />
                      <FaStar size={16} className={modalSmart.rating >= 3 ? "text-yellow-400" : "text-gray-300/50"} />
                      <FaStar size={16} className={modalSmart.rating >= 4 ? "text-yellow-400" : "text-gray-300/50"} />
                      <FaStar size={16} className={modalSmart.rating >= 4.8 ? "text-yellow-400" : "text-gray-300/50"} />
                    </div>
                    <span className="text-sm font-bold text-white ml-2 drop-shadow-md">
                      {modalSmart.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-300 drop-shadow-md">
                      ({modalSmart.count} reviews)
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-4 border-t border-white/20 pt-4">
                    <p className="text-gray-300 text-sm md:text-base font-medium line-clamp-2 max-w-[70%]">
                      {selectedProduct.description}
                    </p>
                    <p className="text-[#E8C39E] text-2xl font-black shrink-0">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        );
      })()}
    </div>
  );
}

export default Menu;
