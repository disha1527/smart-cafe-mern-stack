import React, { useContext, useEffect, useState } from "react";
import { Search, Bell, User, Moon, IndianRupee , ShoppingBag, ClipboardList, Users } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

function StatCard({ title, value, icon, accent }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] border border-white/80">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#6b7280]">
            {title}
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#111827]">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-lg shadow-sm`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { adminToken, admin } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adminToken) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/orders", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          fetch("http://localhost:5000/api/admin/products", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          fetch("http://localhost:5000/api/admin/bookings", {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];

        if (ordersRes.ok) {
          setOrders(ordersData.orders || ordersData || []);
        }
        if (productsRes.ok) {
          setProducts(productsData.products || []);
        }
        if (bookingsRes.ok) {
          setBookings(bookingsData.bookings || bookingsData || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [adminToken]);

  const totalSales = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0,
  );
  const totalOrders = orders.length;
  const totalMenu = products.length;
  const totalStaff = 100;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  const dailyAnalyticsData = last7Days.map((dayStr, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const targetDate = d.toISOString().split('T')[0];

    const dailyRevenue = orders.reduce((sum, order) => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === targetDate ? sum + (order.totalPrice || 0) : sum;
    }, 0);

    const dailyBookings = bookings.filter(booking => {
      const bDate = new Date(booking.createdAt || booking.date).toISOString().split('T')[0];
      return bDate === targetDate;
    }).length;

    return { name: dayStr, Revenue: dailyRevenue, Bookings: dailyBookings };
  });

  const productCountMap = {};
  orders.forEach((order) => {
    order.orderItems?.forEach((item) => {
      const name = item.product?.name || item.product || "Unknown Item";
      const quantity = item.quantity || 0;
      productCountMap[name] = (productCountMap[name] || 0) + quantity;
    });
  });

  const productChartData = Object.entries(productCountMap)
    .map(([name, quantity]) => ({ name, Quantity: quantity }))
    .sort((a, b) => b.Quantity - a.Quantity)
    .slice(0, 6);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f8f5f2] text-[#111827] mt-20">
      <div className="grid min-h-full grid-cols-[280px_1fr] gap-6 px-6 py-6">
        <aside className="rounded-[2rem] border border-[#e8eaf6] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]" style={{ height: "680px" }}>
          <div className="flex items-center gap-3 pb-8">
            <div className="w-10 h-10 rounded-full bg-[#6F4E37] flex items-center justify-center shadow">
              <span className="text-white text-sm font-bold">QC</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#6b7280]">
                QuickCafe
              </p>
              <h1 className="text-xl font-semibold text-[#111827]">Admin</h1>
              <p className="text-sm text-[#6b7280]">Administrator</p>
            </div>
          </div>

          <nav className="space-y-3">
            {[{ label: "Dashboard", icon: "⛅", active: true }].map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-[1.5rem] px-4 py-3 text-left text-sm font-semibold transition ${item.active
                    ? "bg-[#eef2ff] text-[#6F4E37]"
                    : "text-[#6b7280] hover:bg-[#f8f6ff]"
                  }`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#f8f9ff] text-lg">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
            <p className="text-2xl text-[#6b7280] font-medium " style={{ fontFamily: " 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
              Welcome back, here is your dashboard overview.
            </p>
          </nav>
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mt-3 text-3xl font-semibold text-[#111827]">
                Dashboard
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[300px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-3xl border border-[#e5e7eb] bg-white py-3 pl-12 pr-4 text-sm text-[#111827] outline-none shadow-sm"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-3xl bg-[#6F4E37] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#5e4538] transition">
                <Bell size={18} /> Notifications
              </button>
              <div className="flex items-center gap-3 rounded-3xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
                <div className="h-11 w-11 rounded-full bg-[#ede9fe] grid place-items-center text-[#6F4E37]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#6b7280]">Good afternoon</p>
                  <p className="font-semibold text-[#111827]">{admin?.name || "Admin"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`₹${totalSales.toFixed(0)}`}
              icon={<IndianRupee  className="h-6 w-6" />}
              accent="bg-[#fdf0e4] text-[#6F4E37]"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders || 0}
              icon={<ShoppingBag className="h-6 w-6" />}
              accent="bg-[#f7ebe2] text-[#6F4E37]"
            />
            <StatCard
              title="Total Menu"
              value={totalMenu || 0}
              icon={<ClipboardList className="h-6 w-6" />}
              accent="bg-[#f6efe8] text-[#6F4E37]"
            />
            <StatCard
              title="Total Staff"
              value={totalStaff}
              icon={<Users className="h-6 w-6" />}
              accent="bg-[#f5ede8] text-[#6F4E37]"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] border border-white/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#111827]">
                    Daily Revenue & Bookings
                  </h3>
                  <p className="text-sm text-[#6b7280]">
                    Performance overview for the last 7 days.
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-2 text-sm text-[#374151]">
                  Filter <Moon size={14} />
                </button>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyAnalyticsData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "none",
                        backgroundColor: "#fff",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#6F4E37"
                      strokeWidth={4}
                      dot={{ fill: "#6F4E37" }}
                      activeDot={{ r: 8 }}
                      name="Revenue (₹)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="Bookings"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ fill: "#10b981" }}
                      activeDot={{ r: 8 }}
                      name="Table Bookings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] border border-white/80">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#111827]">
                    Top Ordered Menu Items
                  </h3>
                  <p className="text-sm text-[#6b7280]">
                    Order quantities grouped by product.
                  </p>
                </div>
                <div className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-2 text-sm text-[#374151]">
                  Top 6 Items
                </div>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productChartData}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "none",
                        backgroundColor: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="Quantity"
                      fill="#6F4E37"
                      radius={[12, 12, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


        </main>
      </div>
    </div>
  );
}
