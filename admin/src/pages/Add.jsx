import React, { useState } from 'react'
import { assets } from '../../src/assets/assets.js'
import { backend_url } from '../App.jsx';
import axios from 'axios';

const Add = ({ token }) => {


  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [size, setSize] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);


const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subcategory);          // match backend key
    formData.append("sizes", JSON.stringify(size || []));      // backend parses JSON
    formData.append("bestSeller", bestSeller ? "true" : "false");  // string

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    const response = await axios.post(
      backend_url + "/api/v1/products/add-product",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};



  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        <p className='mb-2'> Upload Image </p>

        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" className='w-20 cursor-pointer' />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" hidden id="image1" />
          </label>

          <label htmlFor="image2">
            <img src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" className='w-20' />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" hidden id="image2" />
          </label>

          <label htmlFor="image3">
            <img src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" className='w-20 cursor-pointer' />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" hidden id="image3" />
          </label>

          <label htmlFor="image4">
            <img src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" className='w-20' />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" hidden id="image4" />
          </label>
        </div>
      </div>

      <div className='w-full mb-4 mt-4'>
        <p className='mb-1'> Product Name </p>
        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type Here' className='w-full max-w-[500px] px-3 py-2' />
      </div>

      <div className='w-full'>
        <p className='mb-1'> Product Description </p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder='Type Here' className='w-full max-w-[500px] px-3 py-2' />
      </div>

      <div className='mt-4 flex fle-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'> Product Category </p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men"> Men </option>
            <option value="Women"> Women </option>
            <option value="Kids"> Kids </option>
          </select>
        </div>

        <div>
          <p className='mb-2'> Product Sub-Category </p>
          <select onChange={(e) => setSubcategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear"> Topwear </option>
            <option value="Bottomwear"> Bottomwear </option>
            <option value="Winterwear"> Winterwear </option>
          </select>
        </div>

        <div>
          <p className='mb-2'> Product Price </p>
          <input onChange={(e) => { setPrice(e.target.value) }} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
        </div>
      </div>

      <div>
        <p className='mb-2 mt-2'> Product Size </p>
        <div className='flex gap-2 mt-2 mb-4'>
          <div onClick={() => setSize(prev => prev.includes("S") ? prev.filter(item => item !== 'S') : [...prev, "S"])}>
            <p className={`${size.includes("S") ? "bg-black text-white" : "bg-pink-200 text-black"} border-orange-300 border px-3 py-1 cursor-pointer`}>S</p>
          </div>

          <div onClick={() => setSize(prev => prev.includes("M") ? prev.filter(item => item !== 'M') : [...prev, "M"])}>
            <p className={`${size.includes("M") ? "bg-black text-white" : "bg-pink-200 text-black"} border-orange-300 border px-3 py-1 cursor-pointer`}>M</p>
          </div>

          <div onClick={() => setSize(prev => prev.includes("L") ? prev.filter(item => item !== 'L') : [...prev, "L"])}>
            <p className={`${size.includes("L") ? "bg-black text-white" : "bg-pink-200 text-black"} border-orange-300 border px-3 py-1 cursor-pointer`}>L</p>
          </div>

          <div onClick={() => setSize(prev => prev.includes("XL") ? prev.filter(item => item !== 'XL') : [...prev, "XL"])}>
            <p className={`${size.includes("XL") ? "bg-black text-white" : "bg-pink-200 text-black"} border-orange-300 border px-3 py-1 cursor-pointer`}>XL</p>
          </div>

          <div onClick={() => setSize(prev => prev.includes("XXL") ? prev.filter(item => item !== 'XXL') : [...prev, "XXL"])}>
            <p className={`${size.includes("XXL") ? "bg-black text-white" : "bg-pink-200 text-black"} border-orange-300 border px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id='bestSeller' />
          <label htmlFor="bestSeller" className='cursor-pointer'> Add to Best Seller </label>
        </div>

      </div>

      <button type='submit' className='w-30 px-4 py-3 mt-4 bg-black text-white'> ADD PRODUCT </button>

    </form>
  )
}

export default Add