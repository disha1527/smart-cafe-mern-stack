import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaHome, FaUtensils, FaStar } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const processOrder = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const payment = params.get("payment");

        if (payment === "success") {
          const storedAddress = localStorage.getItem("deliveryAddress") || "";
          const storedName = localStorage.getItem("deliveryName") || "";
          const storedPhone = localStorage.getItem("deliveryPhone") || "";
          const storedEmail = localStorage.getItem("deliveryEmail") || "";

          await fetch("http://https://"https://smart-cafe-mern-stack.onrender.com"/api/orders/stripe", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ 
              address: storedAddress,
              deliveryName: storedName,
              deliveryPhone: storedPhone,
              deliveryEmail: storedEmail
            })
          });

          localStorage.removeItem("deliveryAddress");
          localStorage.removeItem("deliveryName");
          localStorage.removeItem("deliveryPhone");
          localStorage.removeItem("deliveryEmail");
        }

        // Fetch user's latest order
        const res = await fetch("http://https://"https://smart-cafe-mern-stack.onrender.com"/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        
        if (data && data.length > 0) {
          setOrder(data[0]);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [location.search, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewProduct) return;
    
    try {
      const res = await fetch(`http://https://"https://smart-cafe-mern-stack.onrender.com"/api/products/${reviewProduct._id}/reviews`, {
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
        setReviewModalOpen(false);
        setComment("");
        setRating(5);
      } else {
        alert(data.message || "Failed to add review.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleDownload = async () => {
    const element = invoiceRef.current;
    if (!element) return;
    
    // Temporarily hide the action buttons and success header for the clean invoice screenshot
    const actionsDiv = element.querySelector('.action-buttons');
    const headerDiv = element.querySelector('.success-header');
    
    if (actionsDiv) actionsDiv.style.display = 'none';
    if (headerDiv) headerDiv.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let remainingHeight = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      remainingHeight -= pdfPageHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        remainingHeight -= pdfPageHeight;
      }

      pdf.save(`SmartCafe_Invoice_${order._id.substring(order._id.length - 8)}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
      if (actionsDiv) actionsDiv.style.display = 'flex';
      if (headerDiv) headerDiv.style.display = 'block';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3]">
        <p className="text-xl font-semibold text-[#7B3F00] animate-pulse">Processing your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5ECE3] px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No recent order found</h1>
        <button onClick={() => navigate("/menu")} className="bg-[#7B3F00] text-white px-6 py-3 rounded-full">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] via-[#f7efe5] to-[#f1e3d3] pt-28 px-4 sm:px-8 pb-20 flex justify-center items-start">
      
      {/* Invoice Card */}
      <div 
        ref={invoiceRef}
        className="bg-white shadow-2xl rounded-[2rem] w-full max-w-3xl overflow-hidden print:shadow-none print:bg-white print:max-w-full"
      >
        
        {/* Header (Success Alert) - Hidden on print/download */}
        <div className="success-header bg-[#7B3F00] text-white p-8 text-center print:hidden">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-6xl text-[#E8C39E]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Order Confirmed!</h1>
          <p className="text-[#F5ECE3] text-lg">Thank you for choosing Smart Cafe.</p>
        </div>

        {/* Invoice Header */}
        <div className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-2 border-gray-100 pb-8 mb-8">
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Smart Cafe</h2>
              <p className="text-gray-500 mt-1">123 Coffee Street, Cafe City</p>
              <p className="text-gray-500">Tax Invoice / Bill of Supply</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-600 font-medium">Order ID</p>
              <p className="text-xl font-bold text-gray-900 uppercase tracking-wider">{order._id.substring(order._id.length - 8)}</p>
              <p className="text-gray-500 text-sm mt-2">{new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-1 font-semibold uppercase bg-gray-100 px-3 py-1 rounded-full inline-block">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Customer / Delivery Contact</p>
              <p className="font-bold text-gray-900">{order.deliveryName || "N/A"}</p>
              <p>{order.deliveryPhone || "N/A"}</p>
              <p>{order.deliveryEmail || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Delivery Address</p>
              <p className="leading-relaxed">{order.address || "N/A"}</p>
            </div>
          </div>

          {/* Professional Table Items List */}
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/80 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                  <th className="py-4 px-6 font-extrabold">Item Description</th>
                  <th className="py-4 px-6 font-extrabold text-center hidden sm:table-cell">Qty</th>
                  <th className="py-4 px-6 font-extrabold text-right hidden sm:table-cell">Price</th>
                  <th className="py-4 px-6 font-extrabold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-5">
                        <div className="shrink-0 hidden sm:block">
                          <img
                            src={getProductImageSrc(item.product?.image)}
                            alt={item.product?.name || "Product"}
                            className="w-14 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <p className="text-lg font-bold text-gray-900 leading-none">
                              {item.product?.name || "Unknown Item"}
                            </p>
                            <span className="text-xs font-semibold text-[#7B3F00] bg-[#F5ECE3] px-2.5 py-1 rounded-md border border-[#7B3F00]/20 flex items-center justify-center">
                              {item.size || "Regular"}
                            </span>
                          </div>
                          {item.product?.description && (
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm">
                              {item.product.description}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setReviewProduct(item.product);
                              setReviewModalOpen(true);
                            }}
                            className="text-[#7B3F00] text-xs font-bold underline mt-1 hover:text-[#5a2e00] transition print:hidden"
                          >
                            Write a Review
                          </button>
                          {/* Mobile only Qty & Price */}
                          <p className="text-gray-500 text-xs mt-2 font-medium sm:hidden block">
                            Qty: {item.quantity} × ₹{item.product?.price || 0}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center font-semibold text-gray-700 hidden sm:table-cell">
                      {item.quantity}
                    </td>
                    <td className="py-5 px-6 text-right font-medium text-gray-600 hidden sm:table-cell">
                      ₹{item.product?.price || 0}
                    </td>
                    <td className="py-5 px-6 text-right font-black text-[#7B3F00] text-lg">
                      ₹{(item.product?.price || 0) * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            
            {/* Status Message */}
            <div className="text-center sm:text-left bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-200">
              <p className="font-bold flex items-center gap-2 justify-center sm:justify-start">
                <FaCheckCircle /> {order.paymentMethod === "Stripe" ? "Payment Successful" : "To be paid on delivery"}
              </p>
              <p className="text-sm mt-1 opacity-80">Order will be prepared shortly.</p>
            </div>

            {/* Total Calculation */}
            <div className="w-full sm:w-64 space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100 print:bg-transparent print:border-none">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-gray-900">₹{order.totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-3">
                <span className="font-medium">Tax & Fees</span>
                <span className="font-semibold text-gray-900">₹{Math.round(order.totalPrice * 0.05)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-[#7B3F00]">
                  ₹{order.totalPrice + Math.round(order.totalPrice * 0.05)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden on print */}
        <div className="action-buttons bg-gray-50 p-6 sm:p-8 border-t border-gray-100 flex flex-wrap gap-4 justify-center print:hidden">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
          >
            <FaDownload /> Download Bill
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="flex items-center gap-2 bg-[#7B3F00] text-white px-8 py-3 rounded-xl hover:bg-[#5a2e00] hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold"
          >
            <FaUtensils /> Order More
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all font-semibold"
          >
            <FaHome /> Home
          </button>
        </div>

      </div>

      {/* Review Modal */}
      {reviewModalOpen && reviewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-[zoomIn_0.2s_ease-out]">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate your experience</h3>
            <p className="text-gray-500 mb-6 text-sm">How did you like the {reviewProduct.name}?</p>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={32}
                    className={`cursor-pointer transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Leave a comment (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]/50 focus:border-[#7B3F00] transition-all resize-none"
                  rows="4"
                  placeholder="Tell us what you liked..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#7B3F00] text-white font-semibold hover:bg-[#5a2e00] transition shadow-lg shadow-[#7B3F00]/20"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderSuccess;