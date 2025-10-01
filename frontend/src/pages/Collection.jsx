// Collection.jsx
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toAbsolute = (v) => {
    if (!v) return '';
    if (typeof v === 'object') {
      const raw = v.secure_url || v.url || v.path || v.location || v.src || '';
      return toAbsolute(raw);
    }
    return String(v); // Cloudinary URLs are already absolute
  };

  const toggleCategory = (e) => {
    const val = e.target.value;
    setCategory(prev => (prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]));
  };

  const toggleSubCategory = (e) => {
    const val = e.target.value;
    setSubCategory(prev => (prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]));
  };

  useEffect(() => {
    let list = [...(products || [])];

    if (category.length) list = list.filter(p => category.includes(p.category));
    if (subCategory.length) list = list.filter(p => subCategory.includes(p.subCategory));

    if (showSearch && search) {
      list = list.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (sortType === 'low-high') {
      list = [...list].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (sortType === 'high-low') {
      list = [...list].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    }

    setFilteredProducts(list);
  }, [products, category, subCategory, sortType, showSearch, search]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* LEFT: Filters (unchanged) */}
      {/* ... */}

      {/* RIGHT: Results */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title txt1="ALL" txt2=" COLLECTIONS" />
          <select
            className="border-2 border-gray-300 text-sm px-2 py-1"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.map((item) => {
            const first =
              Array.isArray(item.images) ? item.images[0]
              : Array.isArray(item.image) ? item.image[0]
              : item.image;
            const imageUrl = toAbsolute(first);

            return (
              <ProductItem
                key={item._id ?? item.id}
                id={item._id ?? item.id}
                name={item.name}
                price={item.price}
                image={imageUrl}
              />
            );
          })}

          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-sm text-gray-500">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
