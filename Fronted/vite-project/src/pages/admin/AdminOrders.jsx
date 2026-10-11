






import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Package, IndianRupee , Trash2, CheckCircle, Clock, Filter, ChevronRight } from 'lucide-react';

export default function AdminOrders() {
  const { adminToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'pending'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://https://smart-cafe-mern-stack.onrender.com/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchOrders();
  }, [adminToken]);

  const togglePaymentStatus = async (orderId, currentPaid) => {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch(`http://https://smart-cafe-mern-stack.onrender.com/api/admin/orders/update/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPaid: !currentPaid }),
      });
      if (res.ok) await fetchOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order permanently?')) return;
    setDeletingOrder(orderId);
    try {
      const res = await fetch(`http://https://smart-cafe-mern-stack.onrender.com/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) await fetchOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'paid') return order.isPaid;
    if (filter === 'pending') return !order.isPaid;
    return true;
  });

  const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 font-sans text-slate-900 mt-16">
      <div className="max-w-7xl mx-auto">
        
        {/* --- STATS HEADER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold">{orders.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-green-600"><IndianRupee  size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Gross Revenue</p>
              <h3 className="text-2xl font-bold">₹{totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Tasks</p>
              <h3 className="text-2xl font-bold">{orders.filter(o => !o.isPaid).length}</h3>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['all', 'pending', 'paid'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Syncing orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <p>No orders found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left: Customer Info */}
                    <div className="lg:w-1/4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {order.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 leading-tight">{order.user?.name || 'Guest'}</h4>
                          <p className="text-xs text-slate-500">{order.user?.email}</p>
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-4 font-bold">Order ID</p>
                      <p className="text-xs font-mono text-slate-600">{order._id.slice(-12)}</p>
                    </div>

                    {/* Middle: Items & Summary */}
                    <div className="lg:w-2/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 font-bold">Purchased Items</p>
                        <div className="space-y-1">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span className="text-slate-700">{item.quantity}x {item.product?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Date:</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-800">
                          <span>Total:</span>
                          <span>₹{order.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="lg:w-1/4 flex flex-row lg:flex-col justify-between lg:justify-center items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                        order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.isPaid ? <CheckCircle size={14}/> : <Clock size={14}/>}
                        {order.isPaid ? 'Paid' : 'Awaiting'}
                      </span>
                      
                      <div className="flex gap-2 w-full lg:w-auto">
                        <button
                          onClick={() => togglePaymentStatus(order._id, order.isPaid)}
                          disabled={updatingOrder === order._id}
                          className="flex-1 lg:flex-none p-2.5 rounded-xl border border-slate-200 hover:bg-white hover:shadow-md transition-all text-slate-600"
                          title="Toggle Status"
                        >
                          <Filter size={18} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          disabled={deletingOrder === order._id}
                          className="flex-1 lg:flex-none p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Delivery Info Sub-section */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-700">Deliver To:</span> {order.deliveryName || 'N/A'} <span className="text-slate-400">|</span> <span className="font-bold text-slate-700">Phone:</span> {order.deliveryPhone || 'N/A'} <span className="text-slate-400">|</span> <span className="font-bold text-slate-700">Email:</span> {order.deliveryEmail || 'N/A'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Address:</span> {order.address || 'N/A'}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}