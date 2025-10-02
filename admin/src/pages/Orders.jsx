import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url, currency } from "../App.jsx";
import { assets } from "../assets/assets.js";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setOrders(prev =>
      prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const response = await axios.post(
        `${backend_url}/api/v1/orders/update-status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
      } else {
        toast.error(response.data.message);
        fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      fetchAllOrders();
    }
  };

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backend_url}/api/v1/orders/get-all-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) setOrders(response.data.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold text-center mb-10">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex items-center gap-3">
                <img src={assets.parcel_icon} alt="Parcel" className="w-10 h-10" />
                <div>
                  {order.items.map(item => (
                    <p key={item._id} className="text-gray-700 text-sm">
                      {item.name} x {item.quantity} ({item.size})
                    </p>
                  ))}
                </div>
              </div>

              <div className="text-gray-700 text-sm">
                <p className="font-semibold">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.email}</p>
                <p>
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                </p>
                <p>📞 {order.address.phone}</p>
              </div>

              <div className="text-gray-900 font-semibold text-lg">
                {currency}{order.amount}
              </div>

              <div>
                <select
                  value={order.status || "Order Placed"}
                  onChange={e => statusHandler(e, order._id)}
                  className="border rounded px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
