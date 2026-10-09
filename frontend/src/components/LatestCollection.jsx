import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products?.length) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);


  const toAbsolute = (v) => {
    if (!v) return '';
    if (typeof v === 'object') {
      const raw = v.secure_url || v.url || v.path || v.location || v.src || '';
      return toAbsolute(raw);
    }
    return String(v);
  };

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title txt1={'LATEST '} txt2={'COLLECTIONS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover a new expression of style with <span className='text-blue-400 font-bold'>Vien</span> , where modern fashion meets everyday elegance.
          Explore a curated collection of timeless essentials and contemporary trends, designed to complement your individuality.
          From casual comfort to effortless sophistication, find pieces that make every moment stylish.
          <span className='text-blue-900 font-bold'>Your style. Your statement. Your Vien.</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {latestProducts.map((item, index) => {
          const first =
            Array.isArray(item.images) ? item.images[0]
            : Array.isArray(item.image) ? item.image[0]
            : item.image;
          const imageUrl = toAbsolute(first);

          return (
            <ProductItem
              key={item._id ?? index}
              id={item._id}
              image={imageUrl}
              name={item.name}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
