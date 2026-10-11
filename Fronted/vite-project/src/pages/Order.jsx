// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Order() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const res = await fetch(`http://https://"https://smart-cafe-mern-stack.onrender.com"/api/products/${id}`);
//       const data = await res.json();
//       setProduct(data);
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) return <p className="text-center mt-20">Loading...</p>;

//   return (
//     <div className="mt-24 px-10 min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        
//         <img
//           src={`http://https://"https://smart-cafe-mern-stack.onrender.com"/${product.image}`}
//           alt={product.name}
//           className="w-full h-64 object-cover rounded-lg"
//         />

//         <h1 className="text-3xl font-bold mt-6">{product.name}</h1>

//         <p className="text-gray-600 mt-3">{product.description}</p>

//         <p className="text-orange-500 text-2xl font-bold mt-4">
//           ₹ {product.price}
//         </p>

//         <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
//           Confirm Order
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Order;




import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

function Order() {

  const getProductImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/150";

    if (image.startsWith("http")) return image;

    if (image.startsWith("/uploads/")) {
      return `http://https://"https://smart-cafe-mern-stack.onrender.com"${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `http://https://"https://smart-cafe-mern-stack.onrender.com"/${image}`;
    }

    return `http://https://"https://smart-cafe-mern-stack.onrender.com"/uploads/${image.replace(/^\/+/, "")}`;
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {

    const fetchProduct = async () => {

      const res = await fetch(`http://https://"https://smart-cafe-mern-stack.onrender.com"/api/products/${id}`);
      const data = await res.json();

      setProduct(data);

    };

    fetchProduct();

  }, [id]);

  if (!product)
    return <p className="text-center mt-20 text-lg">Loading product...</p>;

  return (

    <div className="min-h-screen bg-[#F5ECE3] pt-24 px-6">

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">

        {/* Product Image */}
        <img
          src={getProductImageSrc(product.image)}
          alt={product.name}
          className="w-full h-[420px] object-cover"
        />

        {/* Product Info */}
        <div className="p-8 flex flex-col justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h1>

            <p className="text-gray-600 mt-4">
              {product.description}
            </p>

            <p className="text-3xl font-bold text-[#7B3F00] mt-6">
              ₹{product.price}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-6">

              <button
                onClick={() => qty > 1 && setQty(qty - 1)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              >
                <FaMinus />
              </button>

              <span className="text-xl font-semibold">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              >
                <FaPlus />
              </button>

            </div>

            {/* Total */}
            <p className="text-xl font-semibold mt-4">
              Total: ₹{product.price * qty}
            </p>

          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">

            <button
              className="flex-1 bg-[#7B3F00] text-white py-3 rounded-lg hover:bg-[#5a2e00] transition"
            >
              Confirm Order
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="flex-1 border border-gray-400 py-3 rounded-lg hover:bg-gray-100"
            >
              Back to Menu
            </button>

          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-8 shadow-xl rounded-2xl mb-20">
        <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
        
        {/* Display Reviews */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No reviews yet. Be the first to review!</p>
        )}

        {/* Add Review Form */}
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const rating = e.target.rating.value;
          const comment = e.target.comment.value;
          const token = localStorage.getItem("token");

          if (!token) return alert("Please login to review!");

          try {
            const res = await fetch(`http://https://"https://smart-cafe-mern-stack.onrender.com"/api/products/${id}/reviews`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();
            if (res.ok) {
              alert("Review added successfully!");
              window.location.reload();
            } else {
              alert(data.message || "Failed to add review.");
            }
          } catch (err) {
            console.error(err);
          }
        }}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <select name="rating" className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3F00]">
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Comment</label>
            <textarea name="comment" required rows="3" className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"></textarea>
          </div>
          <button type="submit" className="bg-[#7B3F00] text-white px-6 py-2 rounded-lg hover:bg-[#5a2e00] transition">
            Submit Review
          </button>
        </form>
      </div>

    </div>

  );
}

export default Order;