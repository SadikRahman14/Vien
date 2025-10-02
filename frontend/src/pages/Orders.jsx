// Orders.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Orders = () => {
  const { token, currency, backend_url } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]); // grouped orders
  const [loading, setLoading] = useState(false);

  // Robust image extractor
  const extractUrlFromValue = (val) => {
    if (!val) return null;
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (typeof val === 'object') {
      return (
        val.secure_url ||
        val.url ||
        val.path ||
        val.location ||
        val.src ||
        val.raw ||
        null
      );
    }
    return null;
  };

  const getFirstImageUrl = (productOrItem) => {
    if (!productOrItem) return null;

    // check common places in order of priority
    const candidates = [
      productOrItem.images,
      productOrItem.image,
      productOrItem.gallery,
      productOrItem.pictures,
    ];

    for (const cand of candidates) {
      if (!cand) continue;
      if (Array.isArray(cand) && cand.length > 0) {
        const url = extractUrlFromValue(cand[0]);
        if (url) return url;
      } else {
        const url = extractUrlFromValue(cand);
        if (url) return url;
      }
    }

    // also try nested image objects
    const alt =
      productOrItem?.images?.[0] ||
      productOrItem?.image?.[0] ||
      productOrItem?.thumbnail ||
      productOrItem?.img ||
      null;
    return extractUrlFromValue(alt) || null;
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        setOrderData([]);
        return;
      }
      setLoading(true);
      const resp = await axios.get(`${backend_url}/api/v1/orders/get-user-order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // debug
      console.log('get-user-order raw response:', resp?.data);

      // find orders array in response
      let orders = null;
      if (Array.isArray(resp?.data?.data)) orders = resp.data.data;
      else if (Array.isArray(resp?.data?.message)) orders = resp.data.message;
      else if (Array.isArray(resp?.data?.orders)) orders = resp.data.orders;
      else if (Array.isArray(resp?.data)) orders = resp.data;
      else orders = [];

      setOrderData(Array.isArray(orders) ? orders.reverse() : []);
    } catch (err) {
      console.error('loadOrderData error:', err, err?.response?.data ?? err?.message);
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Render grouped orders
  return (
    <div className="border-t pt-16">
      <div className="text-3xl mb-6 flex justify-center items-center">
        <Title txt1={'MY'} txt2={'ORDERS'} />
      </div>

      {loading && (
        <div className="py-8 text-center text-gray-500">Loading orders…</div>
      )}

      {!loading && orderData.length === 0 && (
        <div className="py-8 text-center text-gray-500">You have no orders yet.</div>
      )}

      <div>
        {orderData.map((order) => (
          <div key={order._id ?? order.id} className="mb-6 border rounded p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-black">Placed: {order.date ? new Date(order.date).toLocaleString() : '—'}</div>
               <div className="text-xs text-black font-bold">
                Payment Method: {order.paymentMethod ?? '—'}
              </div>
              
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 rounded text-white bg-green-600">{order.status ?? 'unknown'}</span>
              </div>
            </div>

            {/* items */}
            <div className="space-y-3">
              {(Array.isArray(order.items) ? order.items : []).map((item, idx) => {
                const imageUrl = getFirstImageUrl(item);
                return (
                  <div key={item._id ?? idx} className="py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name || 'product'}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = assets.placeholder || '' }}
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded">
                          no image
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium">{item.name ?? 'Unnamed product'}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <p>{currency}{item.price ?? '—'}</p>
                          <p>Qty: {item.quantity ?? 1}</p>
                          <p>Size: {item.size ?? '—'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/4 flex flex-col items-start md:items-end justify-between">
                      <div className="text-sm text-gray-600">Payment: {String(order.payment ?? false)}</div>
                      <button className="mt-3 bg-[#0C586A] hover:bg-[#07353f] text-white px-4 py-2 text-sm rounded">
                        Track Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
