import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getUserCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (getUserCart) getUserCart();
  }, [getUserCart]);

  const toAbsolute = (v) => {
    if (!v) return '';
    if (typeof v === 'object') {
      const raw = v.secure_url || v.url || v.path || v.location || v.src || '';
      return toAbsolute(raw);
    }
    return String(v);
  };

  const getFirstImageUrl = (product) => {
    if (!product) return '';
    const first =
      Array.isArray(product.images) ? product.images[0]
      : Array.isArray(product.image) ? product.image[0]
      : product.image;
    return toAbsolute(first);
  };

  // Transform cartItems into array for rendering
  useEffect(() => {
    const temp = [];
    for (const productId in cartItems) {
      const sizesObj = cartItems[productId] || {};
      for (const size in sizesObj) {
        const qty = sizesObj[size];
        if (qty > 0) {
          temp.push({ _id: productId, size, quantity: qty });
        }
      }
    }
    setCartData(temp);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="flex items-center justify-center text-3xl mb-3">
        {cartData.length === 0
          ? <Title txt1={'YOUR CART IS'} txt2={'EMPTY'} />
          : <Title txt1={'REVIEW YOUR'} txt2={'CART'} />
        }
      </div>

      <div className='mb-10'>
        {cartData.map((item, index) => {
          const productData = (products || []).find(
            (p) => String(p?._id) === String(item._id)
          );

          const imageUrl = getFirstImageUrl(productData);
          const name = productData?.name || 'Product unavailable';
          const price = productData?.price ?? 0;

          return (
            <div
              key={`${item._id}-${item.size}-${index}`}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} className="w-16 sm:w-20 object-cover" />
                ) : (
                  <div className="w-16 sm:w-20 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                    no image
                  </div>
                )}

                <div>
                  <p className="text-xs sm:text-lg font-medium">{name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="px-2 sm:px-3 sm:py-1 border text-white bg-green-500">
                      {currency}{price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-300">{item.size}</p>
                  </div>
                </div>
              </div>

              <input
                type="number"
                min={1}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                value={item.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  const n = parseInt(val, 10);
                  if (!Number.isNaN(n) && n > 0) {
                    updateQuantity(item._id, item.size, n);
                  }
                }}
              />

              <img
                src={assets.bin_icon}
                alt="Remove"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                onClick={() => updateQuantity(item._id, item.size, 0)}
              />
            </div>
          );
        })}
      </div>

      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() => navigate('/place-order')}
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
