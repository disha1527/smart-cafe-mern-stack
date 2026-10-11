

import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminToken } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // 🔥 GET PRODUCT DATA (AUTO FILL)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://smart-cafe-mern-stack.onrender.com/api/admin/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await res.json();
        console.log("Product API:", data);

        // 🔥 FIX (handle all cases)
        const product = data.data || data.product || data;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          countInStock: product.countInStock || "",
        });

        // Show existing image as preview
        if (product.image) {
          // Handle both full URLs and relative paths
          if (product.image.startsWith("http")) {
            setImagePreview(product.image);
          } else {
            setImagePreview(`https://smart-cafe-mern-stack.onrender.com${product.image}`);
          }
        }

        setLoadingData(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (adminToken) {
      fetchProduct();
    }
  }, [id, adminToken]);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 IMAGE FILE CHANGE
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 🔥 UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("price", form.price);
      payload.append("category", form.category);
      payload.append("countInStock", form.countInStock);

      // Only append image file if a new one was selected
      if (selectedImageFile) {
        payload.append("imageFile", selectedImageFile);
      }

      const res = await fetch(
        `https://smart-cafe-mern-stack.onrender.com/api/admin/products/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: payload,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Product Updated ✅");
        navigate("/admin/menu");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADING SCREEN
  if (loadingData) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Product ✏️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* 🔥 CHOOSE IMAGE (file picker) */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openFilePicker}
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 hover:bg-gray-200 text-left"
              >
                {selectedImageFile ? selectedImageFile.name : "Choose Image"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* 🔥 IMAGE PREVIEW */}
            {imagePreview && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedImageFile ? "New Image Preview" : "Current Image"}
                </p>
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-40 w-full rounded-lg object-cover border"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="number"
            name="countInStock"
            placeholder="Stock"
            value={form.countInStock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6F4E37] text-white py-3 rounded-lg hover:bg-[#5a3d2b]"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;