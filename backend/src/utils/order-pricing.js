import { ApiError } from './ApiError.js';

// Keep aligned with the storefront's delivery_fee until shipping rules are centralized.
export const DELIVERY_FEE = 10;
const MAX_ITEMS = 100;
const MAX_QUANTITY = 99;
const PRODUCT_ID = /^[a-f0-9]{24}$/i;

export function getRequestedProductIds(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    throw new ApiError(400, `An order must contain 1-${MAX_ITEMS} items`);
  }

  return items.map((item) => {
    const id = item?._id;
    if (typeof id !== 'string' || !PRODUCT_ID.test(id)) {
      throw new ApiError(400, 'Invalid product ID in order');
    }
    return id;
  });
}

export function validateDeliveryAddress(address) {
  if (!address || typeof address !== 'object' || Array.isArray(address)) {
    throw new ApiError(400, 'A delivery address is required');
  }

  const fields = [
    'firstName', 'lastName', 'email', 'street', 'city',
    'state', 'zipcode', 'country', 'phone'
  ];
  const cleanAddress = {};

  for (const field of fields) {
    const value = address[field];
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 200) {
      throw new ApiError(400, `Valid ${field} is required`);
    }
    cleanAddress[field] = value.trim();
  }

  return cleanAddress;
}

export function priceOrderFromProducts(requestedItems, products) {
  getRequestedProductIds(requestedItems);
  const catalog = new Map(products.map((product) => [String(product._id), product]));
  const seen = new Set();
  let subtotalCents = 0;

  const items = requestedItems.map((requested) => {
    const id = requested._id;
    const product = catalog.get(id);
    if (!product) {
      throw new ApiError(400, `Product ${id} is no longer available`);
    }

    const { size, quantity } = requested;
    if (typeof size !== 'string' || !size.trim() || size.length > 32 ||
        !Array.isArray(product.sizes) || !product.sizes.includes(size)) {
      throw new ApiError(400, `Invalid size for product ${id}`);
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new ApiError(400, `Invalid quantity for product ${id}`);
    }

    const key = `${id}:${size}`;
    if (seen.has(key)) {
      throw new ApiError(400, 'Duplicate product and size in order');
    }
    seen.add(key);

    // Never use client-supplied name, price or image data.
    const unitPrice = product.price;
    const unitCents = Math.round(unitPrice * 100);
    if (typeof unitPrice !== 'number' || !Number.isFinite(unitPrice) ||
        unitPrice < 0 || !Number.isSafeInteger(unitCents)) {
      throw new ApiError(400, `Product ${id} has an invalid price`);
    }
    const lineCents = unitCents * quantity;
    if (!Number.isSafeInteger(lineCents) ||
        !Number.isSafeInteger(subtotalCents + lineCents)) {
      throw new ApiError(400, 'Order total is too large');
    }
    subtotalCents += lineCents;

    return {
      _id: product._id,
      name: product.name,
      price: unitCents / 100,
      images: product.images,
      size,
      quantity
    };
  });

  const totalCents = subtotalCents + Math.round(DELIVERY_FEE * 100);
  if (!Number.isSafeInteger(totalCents)) {
    throw new ApiError(400, 'Order total is too large');
  }

  return { items, amount: totalCents / 100 };
}

// A stale or manipulated total must be rejected before an order is persisted.
export function assertQuotedAmountMatches(quotedAmount, verifiedAmount) {
  if (typeof quotedAmount !== 'number' || !Number.isFinite(quotedAmount) ||
      Math.round(quotedAmount * 100) !== Math.round(verifiedAmount * 100)) {
    throw new ApiError(409, 'Order total changed. Refresh your cart and try again.');
  }
}
