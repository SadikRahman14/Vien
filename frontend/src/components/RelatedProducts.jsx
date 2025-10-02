// RelatedProducts.jsx
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const RelatedProducts = ({ category, subcategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  // helper to extract first image URL (defensive)
  const getFirstImage = (product) => {
    if (!product) return '';
    const first =
      Array.isArray(product.images) ? product.images[0]
      : Array.isArray(product.image) ? product.image[0]
      : product.image;
    // the product fields might be objects (cloudinary) — try common keys
    if (!first) return '';
    if (typeof first === 'string') return first;
    return first.secure_url || first.url || first.path || first.location || first.src || '';
  };

  useEffect(() => {
    if (!products || products.length === 0) {
      setRelated([]);
      return;
    }

    // normalize incoming props for comparison
    const wantedCat = (category || '').toString();
    const wantedSub = (subcategory || '').toString();

    let list = products.slice();

    // filter by category if provided
    if (wantedCat) {
      list = list.filter((p) => String(p?.category || '').toLowerCase() === wantedCat.toLowerCase());
    }

    // filter by subcategory if provided (support both keys)
    if (wantedSub) {
      list = list.filter(
        (p) =>
          String(p?.subCategory || p?.subcategory || '')
            .toLowerCase() === wantedSub.toLowerCase()
      );
    }

    // remove the exact same product if category/subcategory came from a product page (optional)
    // If you also have a 'currentProductId' prop, you can exclude that id here.

    // limit to 5 items
    const sliced = list.slice(0, 5);

    // map to normalized objects for safe rendering
    const mapped = sliced.map((p) => ({
      _id: p._id ?? p.id,
      name: p.name,
      price: p.price,
      image: getFirstImage(p),
    }));

    setRelated(mapped);
  }, [products, category, subcategory]);

  if (!related || related.length === 0) return null; // don't render anything if no related products

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title txt1={'RELATED'} txt2={' PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
