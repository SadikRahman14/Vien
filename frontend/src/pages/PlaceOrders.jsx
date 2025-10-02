import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AlertBox from '../components/AlertBox';

const PlaceOrders = () => {
  const [method, setMethod] = useState('cod');
  const [showAlert, setShowAlert] = useState(false);

  const { navigate, backend_url, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const prepareOrderSummary = () => {
    const orderItem = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = structuredClone(products.find(p => p._id === items));
          if (itemInfo) {
            itemInfo.size = item;
            itemInfo.quantity = cartItems[items][item];
            orderItem.push(itemInfo);
          }
        }
      }
    }

    let summary = `Delivery Info:\n`;
    summary += `${formData.firstName} ${formData.lastName}\n${formData.email} \nPhone: ${formData.phone}\n`;
    summary += `Order Items:\n`;
    orderItem.forEach(item => {
      summary += `${item.name} x ${item.quantity} (${item.size}) - $${item.price}\n`;
    });
    summary += `\nPayment Method: ${method.toUpperCase()}\nTotal Amount: $${getCartAmount() + delivery_fee}`;
    return summary;
  };

  const onSubmitHandler = async () => {
    setShowAlert(true);
  };

  const confirmOrder = async () => {
    setShowAlert(false);

    try {
      const orderItem = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(p => p._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItem.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItem,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case 'cod': {
          const response = await axios.post(backend_url + '/api/v1/orders/place-order-cod', orderData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error("Order failed. Please try again.");
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
              <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe' ? 'bg-green-400':''}`}></p>
                <img src={ assets.stripe_logo} className='h-5 mx-4' alt="" />
              </div>
              <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay' ? 'bg-green-400':''}`}></p>
                <img src={ assets.razorpay_logo} className='h-5 mx-4' alt="" />
              </div>
              <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod' ? 'bg-green-400':''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4'> CASH ON DELIVERY</p>
              </div>
            </div>
            <div className='w-full text-end'>
              <button type='button' onClick={onSubmitHandler} className='bg-black text-white text-sm my-8 px-8 py-3'> PROCEED TO CHECKOUT </button>
            </div>
          </div>
        </div>
      </form>

      <AlertBox
        show={showAlert}
        text={prepareOrderSummary()}
        onConfirm={confirmOrder}
        onCancel={() => setShowAlert(false)}
        confirmText="Confirm Order"
        cancelText="Cancel"
      />
    </>
  );
};

export default PlaceOrders;
