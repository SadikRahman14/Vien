import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block">
      <div className="rounded-lg bg-gray-50 p-2">
        {/* keeps cards uniform; shows whole image */}
        <div className="aspect-square w-full flex items-center justify-center">
          <img
            src={Array.isArray(image) ? image[0] : image || 'https://via.placeholder.com/150'}
            alt={name}
            className="max-w-full max-h-full object-contain transition-transform hover:scale-105"
          />
        </div>
      </div>

      <p className="pt-3 pb-1 text-sm line-clamp-2">{name}</p>
      <p className="text-sm font-medium">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
