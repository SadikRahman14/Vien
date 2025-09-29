import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts.jsx'

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    if (!products) return;
    const prod = products.find(p => String(p._id) === String(productId));
    if (prod) {
      setProductData(prod);
      setImage(prod.image?.[0] || '');
    }
  }, [productId, products]);

  if (!productData) return <div className="opacity-0" />;

  const GALLERY_MAX_H = 'max-h-[520px]';

  return (
    <div className="border-t-2 pt-10">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* LEFT: Gallery (thumbs + main image) */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div
            className={`
              w-full sm:w-[18%]
              overflow-x-auto sm:overflow-y-auto
              ${GALLERY_MAX_H}
            `}
          >
 
            <div className="grid grid-cols-4 sm:grid-cols-1 gap-3">
              {productData.image.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(src)}
                  className="border rounded-md overflow-hidden focus:outline-none focus:ring-2"
                >
                  <img
                    src={src}
                    alt={`${productData.name} thumbnail ${i + 1}`}
                    className="w-full h-24 sm:h-28 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main image */}
          <div className={`flex-1 flex items-center justify-center ${GALLERY_MAX_H}`}>
            <img
              src={image}
              alt={productData.name}
              className="object-contain w-auto h-full"
            />
          </div>
        </div>

        {/* RIGHT: Details */}
        <aside className="sm:w-80">
          <h1 className="font-medium text-xl leading-snug">{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={ assets.star_icon} alt="" className='w-3.5'/>
            <img src={ assets.star_icon} alt="" className='w-3.5'/>
            <img src={ assets.star_icon} alt="" className='w-3.5'/>
            <img src={ assets.star_icon} alt="" className='w-3.5'/>
            <img src={ assets.star_dull_icon} alt="" className='w-3.5'/>
            <p className='pl-2'> (122) </p>
          </div>
          <p className='mt-5 text-2xl font-medium'> {currency}{productData.price}</p>
          <p className='mt-5 text-sm text-gray-500 md:w-4/5'>{productData.description}</p>
          

          <div className='flex flex-col my-8 gap-4'>
            <p> Select Size </p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'> ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p> 100% Original. </p>
              <p> Cash on Delivery is available on this product. </p>
              <p> Easy return and exchange policy within 7 days. </p>
          </div>
        </aside>
      </div>

      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'> Description </b>
          <p className='border px-5 py-3 text-sm'> Reviews(122) </p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>This premium cotton t-shirt is designed for all-day comfort. The soft,
              breathable fabric keeps you cool, while the round-neck fit pairs easily
              with any casual or semi-casual look. Perfect for everyday wear.</p>
          <p>Customers love the smooth texture and the durable stitching that holds up
                even after multiple washes. Many recommend sizing true to fit for the best
                look and comfort.
          </p>
        </div>
      </div>
      <RelatedProducts category={productData.category} subcategory={productData.subcategory}/>
    </div>
  );
};

export default Product;
