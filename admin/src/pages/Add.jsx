import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js';
import { backend_url } from '../App.jsx';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const EMPTY_IMAGES = [null, null, null, null];

const validateProduct = ({ name, description, price, images, size }) => {
  const errors = {};

  if (!images.some(Boolean)) {
    errors.images = 'Upload at least one product image.';
  }

  if (!name.trim()) {
    errors.name = 'Product name is required.';
  }

  if (!description.trim()) {
    errors.description = 'Product description is required.';
  }

  if (String(price).trim() === '') {
    errors.price = 'Product price is required.';
  } else if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    errors.price = 'Enter a valid price greater than zero.';
  }

  if (size.length === 0) {
    errors.size = 'Select at least one available size.';
  }

  return errors;
};

const Add = ({ token }) => {
  const [images, setImages] = useState(EMPTY_IMAGES);
  const [previews, setPreviews] = useState(EMPTY_IMAGES);
  const imageInputs = useRef([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subcategory, setSubcategory] = useState('Topwear');
  const [size, setSize] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revoke preview URLs when images are replaced or the page unmounts.
  useEffect(() => {
    const urls = images.map((file) => (file ? URL.createObjectURL(file) : null));
    setPreviews(urls);
    return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [images]);

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError('');
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !file.type.startsWith('image/')) {
      event.target.value = '';
      setErrors((current) => ({ ...current, images: 'Please select a valid image file.' }));
      return;
    }

    setImages((current) => current.map((image, i) => (i === index ? file : image)));
    clearError('images');
  };

  const removeImage = (index) => {
    setImages((current) => current.map((image, i) => (i === index ? null : image)));
    if (imageInputs.current[index]) imageInputs.current[index].value = '';
  };

  const toggleSize = (value) => {
    setSize((current) => (
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    ));
    clearError('size');
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Men');
    setSubcategory('Topwear');
    setSize([]);
    setBestSeller(false);
    setImages([null, null, null, null]);
    imageInputs.current.forEach((input) => { if (input) input.value = ''; });
    setErrors({});
    setSubmitError('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateProduct({ name, description, price, images, size });
    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please correct the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subcategory);
      formData.append('sizes', JSON.stringify(size));
      formData.append('bestSeller', String(bestSeller));

      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(
        `${backend_url}/api/v1/products/add-product`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data?.success) {
        throw new Error(
          typeof response.data?.message === 'string'
            ? response.data.message
            : 'Could not add the product. Please try again.'
        );
      }

      toast.success('Product added successfully.');
      resetForm();
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      const status = error.response?.status;
      let message = 'Could not add the product. Please try again.';

      if (error.code === 'ERR_NETWORK') {
        message = 'Cannot reach the server. Check your connection and try again.';
      } else if (status === 401 || status === 403) {
        message = 'Your admin session is no longer valid. Please sign in again.';
      } else if (status === 413) {
        message = 'The uploaded image is too large. Try a smaller file.';
      } else if (typeof apiMessage === 'string' && apiMessage.trim()) {
        message = apiMessage;
      } else if (status === 400) {
        message = 'The product details were rejected. Check the fields and try again.';
      } else if (status >= 500) {
        message = 'The server could not save this product. Please try again later.';
      } else if (error.message && !error.response) {
        message = error.message;
      }

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-white px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-offset-1 ${
      errors[field]
        ? 'border-red-500 focus:ring-red-300'
        : 'border-gray-300 focus:ring-gray-200'
    }`;

  return (
    <form onSubmit={onSubmitHandler} noValidate className="w-full max-w-[700px] pb-8 text-gray-800">
      <h1 className="text-xl font-semibold mb-1">Add new product</h1>
      <p className="text-sm text-gray-500 mb-6">Fields marked * are required.</p>

      {submitError && (
        <div role="alert" className="mb-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <fieldset className="mb-5">
        <legend className="mb-2 font-medium">Product images <span className="text-red-600">*</span></legend>
        <p className="text-xs text-gray-500 mb-3">Upload at least one image. You can add up to four.</p>
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <label htmlFor={`image${index + 1}`} className={`block rounded-md overflow-hidden cursor-pointer border-2 ${errors.images ? 'border-red-500' : 'border-gray-200'}`}>
                <img
                  src={previews[index] || assets.upload_area}
                  alt={image ? `Preview ${index + 1}` : `Upload image ${index + 1}`}
                  className="h-20 w-20 object-cover bg-white"
                />
                <input
                  ref={(element) => { imageInputs.current[index] = element; }}
                  id={`image${index + 1}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => handleImageChange(index, event)}
                  aria-label={`Upload product image ${index + 1}`}
                />
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-sm leading-none"
                  aria-label={`Remove image ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.images && <p className="mt-2 text-sm text-red-600" role="alert">{errors.images}</p>}
      </fieldset>

      <div className="mb-4">
        <label htmlFor="product-name" className="block mb-1 font-medium">Product name <span className="text-red-600">*</span></label>
        <input
          id="product-name"
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(event) => { setName(event.target.value); clearError('name'); }}
          className={inputClass('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="product-description" className="block mb-1 font-medium">Product description <span className="text-red-600">*</span></label>
        <textarea
          id="product-description"
          rows={4}
          placeholder="Describe the product"
          value={description}
          onChange={(event) => { setDescription(event.target.value); clearError('description'); }}
          className={inputClass('description')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && <p id="description-error" role="alert" className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <div className="flex-1">
          <label htmlFor="product-category" className="block mb-2 font-medium">Product category</label>
          <select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-white px-3 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="product-subcategory" className="block mb-2 font-medium">Product sub-category</label>
          <select id="product-subcategory" value={subcategory} onChange={(event) => setSubcategory(event.target.value)} className="w-full bg-white px-3 py-2">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div className="sm:w-36">
          <label htmlFor="product-price" className="block mb-2 font-medium">Product price <span className="text-red-600">*</span></label>
          <input
            id="product-price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="25.00"
            value={price}
            onChange={(event) => { setPrice(event.target.value); clearError('price'); }}
            className={inputClass('price')}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
          {errors.price && <p id="price-error" role="alert" className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
      </div>

      <fieldset className="mb-4">
        <legend className="font-medium mb-2">Available sizes <span className="text-red-600">*</span></legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={size.includes(value)}
              onClick={() => toggleSize(value)}
              className={`rounded border px-3 py-1.5 text-sm font-medium ${
                size.includes(value)
                  ? 'bg-black text-white border-black'
                  : 'bg-pink-100 text-gray-800 border-pink-200 hover:bg-pink-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        {errors.size && <p role="alert" className="mt-2 text-sm text-red-600">{errors.size}</p>}
      </fieldset>

      <div className="flex items-center gap-2 mb-5">
        <input
          id="bestSeller"
          type="checkbox"
          checked={bestSeller}
          onChange={(event) => setBestSeller(event.target.checked)}
        />
        <label htmlFor="bestSeller" className="cursor-pointer">Add to best sellers</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 rounded-md bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'ADDING PRODUCT...' : 'ADD PRODUCT'}
      </button>
    </form>
  );
};

export default Add;
