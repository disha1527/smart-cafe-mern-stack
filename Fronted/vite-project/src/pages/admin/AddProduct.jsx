

import React, { useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

const AddProduct = () => {
  const { adminToken } = useContext(AuthContext);
  const fileInputRef = React.useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !selectedImageFile ||
      !form.category
    ) {
      alert("Please fill all fields and choose an image");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("price", form.price);
      payload.append("category", form.category);
      payload.append("countInStock", form.countInStock);
      payload.append("imageFile", selectedImageFile);

      const response = await fetch("https://smart-cafe-mern-stack.onrender.com/api/admin/products/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`, // 🔥 important
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product Added Successfully ✅");

        // Reset form
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          countInStock: "",
        });
        setImagePreview("");
        setSelectedImageFile(null);
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] flex justify-center items-center p-6 mt-5">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Product 🍔
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

            {imagePreview && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Preview</p>
                <img
                  src={imagePreview}
                  alt="Selected preview"
                  className="h-40 w-full rounded-lg object-cover border"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Coffee, Pizza)"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="number"
            name="countInStock"
            placeholder="Stock Quantity"
            value={form.countInStock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6F4E37] text-white py-3 rounded-lg hover:bg-[#5a3d2c]"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;




