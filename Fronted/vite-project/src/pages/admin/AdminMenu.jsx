


import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { adminToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 Fetch products
  useEffect(() => {
    if (!adminToken) {
      // Redirect to login if no token
      navigate("/admin/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/products", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (res.status === 401) {
          toast.error("Invalid token! Please login again.");
          navigate("/admin/login");
          return;
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [adminToken, navigate]);

  // 🔥 Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/products/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading products...</p>;
  }

  return (
    <div className="bg-[#F9F5F0] min-h-screen pt-24 px-6 md:px-16">
      <h1 className="text-4xl font-bold text-[#7B3F00] mb-10 text-center">
        Admin Product Management
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found 😢</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `http://localhost:5000${item.image}`
                }
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="font-bold text-lg">{item.name}</h2>
                <div className="flex items-center gap-1 mb-2 mt-1">
                  <div className="flex text-yellow-400">
                    <FaStar size={12} />
                    <FaStar size={12} />
                    <FaStar size={12} />
                    <FaStar size={12} />
                    <FaStar size={12} className={item.price % 3 === 0 ? "text-yellow-400" : "text-yellow-400 opacity-60"} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 ml-1">
                    {item.price % 3 === 0 ? "5.0" : "4.8"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex justify-between mt-4">
                  <span className="font-bold text-[#7B3F00]">₹{item.price}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;