import React, { useContext, useMemo, useRef, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import OrderConfirmationModal from '../components/OrderConfirmationModal';

const PlaceOrders = () => {
  const method = 'cod';
  const [showAlert, setShowAlert] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const pendingOrderRef = useRef(false);

  const { navigate, backend_url, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Share the same cart line items between the preview and the order payload.
  const orderItems = useMemo(() => Object.entries(cartItems || {}).flatMap(([productId, sizes]) => {
    const product = (products || []).find((entry) => String(entry._id) === String(productId));
    if (!product) return [];

    return Object.entries(sizes || {})
      .filter(([, quantity]) => Number(quantity) > 0)
      .map(([size, quantity]) => ({ ...product, size, quantity: Number(quantity) }));
  }), [cartItems, products]);

  const onSubmitHandler = () => {
    if (Object.values(formData).some((value) => !String(value).trim())) {
      toast.error('Complete all delivery information before checkout.');
      return;
    }
    const hasItems = Object.values(cartItems).some((sizes) =>
      Object.values(sizes || {}).some((quantity) => quantity > 0)
    );
    if (!hasItems) {
      toast.error('Your cart is empty.');
      return;
    }
    const lineCount = Object.values(cartItems).reduce(
      (total, sizes) => total + Object.values(sizes || {}).filter((quantity) => Number(quantity) > 0).length,
      0
    );
    if (orderItems.length !== lineCount) {
      toast.error('Some products have not loaded. Please refresh and try again.');
      return;
    }
    setShowAlert(true);
  };

  const confirmOrder = async () => {
    if (pendingOrderRef.current) return;
    pendingOrderRef.current = true;
    setIsPlacingOrder(true);

    try {
      const orderData = {
        address: formData,
        items: orderItems.map(({ _id, size, quantity }) => ({ _id, size, quantity })),
        amount: getCartAmount() + delivery_fee,
      };

      const response = await axios.post(backend_url + '/api/v1/orders/place-order-cod', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setShowAlert(false);
        setCartItems({});
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      pendingOrderRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <form className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vw] border-t' onSubmit={(e) => e.preventDefault()}>
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title txt1={'DELIVERY'} txt2={'INFORMATION'} />
          </div>
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name...' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName}  type="text" placeholder='Last Name...' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          </div>
          <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
            <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          </div>
          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
            <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          </div>
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        </div>

        <div className='mt-8'>
          <div className='mt-8 min-w-80'>
            <CartTotal />
          </div>
          <div className='mt-12'>
            <Title txt1={'PAYMENT'} txt2={'METHOD'} />
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div className='flex items-center gap-3 border p-2 px-3 opacity-50 cursor-not-allowed' aria-disabled="true" title="Unavailable in portfolio demo">
                <span className='text-xs text-gray-600'>Stripe (unavailable)</span>
                <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
              </div>
              <div className='flex items-center gap-3 border p-2 px-3 opacity-50 cursor-not-allowed' aria-disabled="true" title="Unavailable in portfolio demo">
                <span className='text-xs text-gray-600'>Razorpay (unavailable)</span>
                <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
              </div>
              <div className='flex items-center gap-3 border p-2 px-3'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod' ? 'bg-green-400':''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4'> CASH ON DELIVERY</p>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Portfolio demo: orders are simulated and will not be fulfilled.</p>
            <div className='w-full text-end'>
              <button type='button' onClick={onSubmitHandler} className='bg-black text-white text-sm my-8 px-8 py-3'> PROCEED TO CHECKOUT </button>
            </div>
          </div>
        </div>
      </form>

      <OrderConfirmationModal
        show={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={confirmOrder}
        isSubmitting={isPlacingOrder}
        address={formData}
        items={orderItems}
        subtotal={getCartAmount()}
        deliveryFee={delivery_fee}
        currency={currency}
      />
    </>
  );
};

export default PlaceOrders;
