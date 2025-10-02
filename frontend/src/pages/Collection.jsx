// Collection.jsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // derive unique categories & subcategories from products
  const allCategories = useMemo(() => {
    const set = new Set();
    (products || []).forEach(p => { if (p?.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [products]);

  const allSubCategories = useMemo(() => {
    const set = new Set();
    (products || []).forEach(p => { if (p?.subCategory) set.add(p.subCategory); if (p?.subcategory) set.add(p.subcategory); });
    return Array.from(set).sort();
  }, [products]);

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

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType('relevant');
  };

  useEffect(() => {
    let list = [...(products || [])];

    if (category.length) list = list.filter(p => category.includes(p.category));
    if (subCategory.length) {
      // support both camelCase or lower-case property names
      list = list.filter(p => subCategory.includes(p.subCategory || p.subcategory));
    }

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
    <div className="flex flex-col-reverse lg:flex-row gap-6 pt-10 border-t">
      {/* LEFT: Results (takes majority width on large screens) */}
      <div className="flex-1">
        <div className='text-3xl flex items-center justify-center mb-10'>
            <Title txt1="ALL" txt2=" COLLECTIONS" />  
          </div>
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          
          
          <div className="flex items-center gap-3">
            <select
              className="border-2 border-gray-300 text-sm px-2 py-1"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="relevant">Sort by: Relevance</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>

            {/* toggle filters on small screens */}
            <button
              onClick={() => setShowFilter(s => !s)}
              className="px-3 py-1 border rounded text-sm"
            >
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
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

      {/* RIGHT: Filters sidebar */}
      <aside className={`w-full lg:w-80 shrink-0 transition-all ${showFilter ? 'block' : 'hidden'}`}>
        <div className="border p-4 rounded bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-gray-500">Clear</button>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Category</h4>
            <div className="flex flex-col gap-2 max-h-40 overflow-auto pr-2">
              {allCategories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={category.includes(cat)}
                    onChange={toggleCategory}
                    className="w-4 h-4"
                  />
                  <span>{cat}</span>
                </label>
              ))}
              {allCategories.length === 0 && <p className="text-xs text-gray-400">No categories</p>}
            </div>
          </div>

          {/* Subcategories */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Subcategory</h4>
            <div className="flex flex-col gap-2 max-h-40 overflow-auto pr-2">
              {allSubCategories.map((sub) => (
                <label key={sub} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={sub}
                    checked={subCategory.includes(sub)}
                    onChange={toggleSubCategory}
                    className="w-4 h-4"
                  />
                  <span>{sub}</span>
                </label>
              ))}
              {allSubCategories.length === 0 && <p className="text-xs text-gray-400">No subcategories</p>}
            </div>
          </div>

          {/* Price / other quick filters (optional placeholders) */}
          <div className="mb-2">
            <h4 className="text-sm font-medium mb-2">Quick</h4>
            <div className="flex flex-col gap-2 text-sm">
              <button
                onClick={() => setSortType('low-high')}
                className="text-left text-xs py-1"
              >
                Low to High
              </button>
              <button
                onClick={() => setSortType('high-low')}
                className="text-left text-xs py-1"
              >
                High to Low
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Collection;
