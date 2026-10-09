import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DELIVERY_FEE,
  assertQuotedAmountMatches,
  getRequestedProductIds,
  priceOrderFromProducts,
  validateDeliveryAddress
} from '../src/utils/order-pricing.js';

const id = '507f1f77bcf86cd799439011';
const other = '507f1f77bcf86cd799439012';
const product = { _id: id, name: 'Cotton Shirt', price: 19.99, images: ['photo-url'], sizes: ['S', 'M'] };
const goodItem = { _id: id, size: 'M', quantity: 2, price: 0, name: 'Forged product', images: ['fake-image'] };
const address = {
  firstName: 'Test', lastName: 'User', email: 'test@example.com',
  street: 'Main Road', city: 'Dhaka', state: 'Dhaka', zipcode: '1200',
  country: 'Bangladesh', phone: '01000000000'
};

test('uses database price/name/images instead of forged client fields', () => {
  const result = priceOrderFromProducts([goodItem], [product]);
  assert.equal(result.amount, 49.98); // 2 x 19.99 + 10 delivery
  assert.equal(result.items[0].price, 19.99);
  assert.equal(result.items[0].name, 'Cotton Shirt');
  assert.deepEqual(result.items[0].images, ['photo-url']);
  assert.equal(DELIVERY_FEE, 10);
});

test('rejects malformed ids before database lookup', () => {
  assert.throws(() => getRequestedProductIds([{ _id: 'bad', quantity: 1, size: 'M' }]), { statusCode: 400 });
});

test('rejects missing products', () => {
  assert.throws(() => priceOrderFromProducts([{ ...goodItem, _id: other }], [product]), { statusCode: 400 });
});

test('rejects unavailable product sizes', () => {
  assert.throws(() => priceOrderFromProducts([{ ...goodItem, size: 'XXL' }], [product]), { statusCode: 400 });
});

test('rejects invalid quantity: negative, fractional, or too large', () => {
  for (const quantity of [-1, 0, 0.5, 100, '2']) {
    assert.throws(() => priceOrderFromProducts([{ ...goodItem, quantity }], [product]), { statusCode: 400 });
  }
});

test('rejects duplicate product and size', () => {
  assert.throws(() => priceOrderFromProducts([goodItem, goodItem], [product]), { statusCode: 400 });
});

test('rejects malformed or negative database prices', () => {
  for (const price of [-2, Number.NaN, Infinity]) {
    assert.throws(() => priceOrderFromProducts([goodItem], [{ ...product, price }]), { statusCode: 400 });
  }
});

test('validates delivery address and removes extra client fields', () => {
  assert.deepEqual(validateDeliveryAddress({ ...address, admin: true }), address);
  assert.throws(() => validateDeliveryAddress({ ...address, street: '' }), { statusCode: 400 });
});

test('accepts the verified total and rejects forged or outdated quoted totals', () => {
  assert.doesNotThrow(() => assertQuotedAmountMatches(49.98, 49.98));
  for (const amount of [0, -10, 49, '49.98', Number.NaN]) {
    assert.throws(() => assertQuotedAmountMatches(amount, 49.98), { statusCode: 409 });
  }
});
