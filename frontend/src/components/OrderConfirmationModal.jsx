import React, { useEffect, useRef } from 'react';

const formatMoney = (amount, currency = '$') => {
  const value = Number(amount) || 0;
  return `${currency}${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const getProductImage = (product) => {
  const raw = Array.isArray(product?.images)
    ? product.images[0]
    : Array.isArray(product?.image)
      ? product.image[0]
      : product?.image;

  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    return raw.secure_url || raw.url || raw.src || raw.path || '';
  }
  return '';
};

const OrderConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  isSubmitting = false,
  address,
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  currency = '$',
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Keep the page from scrolling and return keyboard focus when the modal closes.
  useEffect(() => {
    if (!show) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isSubmitting) onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = modalRef.current?.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, isSubmitting, onClose]);

  if (!show) return null;

  const fullName = `${address?.firstName || ''} ${address?.lastName || ''}`.trim();
  const cityLine = [address?.city, address?.state, address?.zipcode].filter(Boolean).join(', ');
  const country = address?.country || '';
  const total = Number(subtotal) + Number(deliveryFee);
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[3px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vien-order-review-title"
        aria-describedby="vien-order-review-description"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-[#FFFEFC] text-stone-900 shadow-[0_25px_90px_rgba(0,0,0,0.25)] sm:max-h-[90dvh]"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
              VIEN / CHECKOUT
            </p>
            <h2 id="vien-order-review-title" className="text-2xl font-semibold tracking-tight sm:text-[28px]">
              Review your order
            </h2>
            <p id="vien-order-review-description" className="mt-1 text-sm text-stone-500">
              One last look before you place your order.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close order review"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Scrollable details; footer stays visible on small screens */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-7">
            <div className="space-y-4">
              <section className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[10px] font-semibold text-white">01</span>
                  <h3 className="text-sm font-semibold">Delivery details</h3>
                </div>
                <p className="break-words text-sm font-semibold">{fullName}</p>
                <p className="mt-2 break-words text-sm leading-6 text-stone-600">
                  {address?.street}<br />
                  {cityLine}<br />
                  {country}
                </p>
                <div className="mt-4 border-t border-stone-200 pt-3 text-sm leading-6 text-stone-600">
                  <p className="break-all">{address?.email}</p>
                  <p>{address?.phone}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-[10px] font-semibold text-white">02</span>
                  <h3 className="text-sm font-semibold">Payment method</h3>
                </div>
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  No online payment is needed. This is a portfolio demo order and will not be fulfilled.
                </p>
              </section>
            </div>

            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Your items</h3>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="divide-y divide-stone-200">
                {items.map((item) => {
                  const imageSrc = getProductImage(item);
                  const price = Number(item.price || 0) * Number(item.quantity || 0);
                  return (
                    <div key={`${item._id}-${item.size}`} className="flex gap-3 py-3 first:pt-0">
                      <div className="flex h-[68px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.name || 'Product'} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-semibold tracking-widest text-stone-400">VIEN</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium leading-5">{item.name}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          Size: {item.size} <span className="px-1">·</span> Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 pl-1 text-sm font-semibold">{formatMoney(price, currency)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-3 border-t border-stone-200 pt-4 text-sm">
                <div className="flex justify-between gap-3 text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between gap-3 text-stone-600">
                  <span>Delivery</span>
                  <span>{formatMoney(deliveryFee, currency)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-stone-200 pt-4">
                  <span className="font-semibold">Total</span>
                  <strong className="text-xl font-semibold tracking-tight">{formatMoney(total, currency)}</strong>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Persistent actions */}
        <footer className="flex shrink-0 flex-col gap-3 border-t border-stone-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
          <div className="flex items-center justify-between sm:block">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500 sm:hidden">Total due</span>
            <strong className="text-lg font-semibold sm:hidden">{formatMoney(total, currency)}</strong>
            <p className="hidden text-xs leading-5 text-stone-500 sm:block sm:max-w-[235px]">
              Please double-check your address and order details.
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-11 flex-1 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting || items.length === 0}
              aria-busy={isSubmitting}
              className="min-h-11 flex-[1.5] rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {isSubmitting ? 'Placing order…' : 'Place order →'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default OrderConfirmationModal;
