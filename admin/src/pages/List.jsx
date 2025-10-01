import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_url } from '../App';
import { toast } from 'react-toastify';
import { currency } from '../App';

const List = ({ token }) => {

  const [list, setList] = useState([]);

  const toAbsolute = (v) => {
    if (!v) return "";
    // object -> pick a usable field
    if (typeof v === "object") {
      const raw =
        v.secure_url ||
        v.url ||
        v.path ||
        v.location ||
        v.src ||
        "";
      return toAbsolute(raw);
    }
    // string -> absolute or prefix backend_url for relative paths
    if (/^https?:\/\//i.test(v)) return v;
    return `${backend_url.replace(/\/$/, "")}/${String(v).replace(/^\//, "")}`;
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(backend_url + '/api/v1/products/get-all-products');

      if (response.data.success && Array.isArray(response.data.message)) {
        const products = response.data.message.map((p) => {
          const first = Array.isArray(p.images) ? p.images[0] : null;
          return {
            ...p,
            image: toAbsolute(first), // <- normalized absolute URL string
          };
        });

        setList(products);
        toast.success("Products fetched successfully");
      } else {
        setList([]);
        toast.error("Unexpected response format");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch products");
      setList([]);
    }
  };


  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(backend_url + `/api/v1/products/remove-product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success("Product removed successfully");
        await fetchList();
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not remove product");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <>
      <p className='mb-2'> All Products List </p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-200 text-sm'>
          <b> Image </b>
          <b> Name </b>
          <b> Category </b>
          <b> Price </b>
          <b className='text-center'> Action </b>
        </div>
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 border text-sm' key={index}>
              <img className='w-12' src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency} {item.price}</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List