// Reviews.jsx
import React from 'react';
import { assets } from '../assets/assets';
import Title from './Title';


const Reviews = ({ reviews: incoming }) => {
  const sample = [
    {
      id: 'r1',
      name: 'Ayesha Rahman',
      avatar: '', // optional url
      rating: 5,
      text: 'Great quality and fast delivery. I loved the shirt — perfect fit and the fabric is soft.',
      date: '2025-09-20',
    },
    {
      id: 'r2',
      name: 'Rahim Khan',
      avatar: '',
      rating: 4,
      text: 'Good product overall. Color was slightly different than photos but still happy with purchase.',
      date: '2025-08-15',
    },
    {
      id: 'r3',
      name: 'Fatima Noor',
      avatar: '',
      rating: 5,
      text: 'Excellent customer service when I requested an exchange. Highly recommended.',
      date: '2025-07-30',
      },
    {
      id: 'r4',
      name: 'Jhakanaka Khan',
      avatar: '',
      rating: 3,
      text: 'Excellent customer service when I requested an exchange. Highly recommended.',
      date: '2025-02-30',
      },
    {
      id: 'r5',
      name: 'Osthir Sejon',
      avatar: '',
      rating: 5,
      text: 'Excellent customer service when I requested an exchange. Highly recommended.',
      date: '2025-10-30',
    },
  ];

  const reviews = Array.isArray(incoming) && incoming.length ? incoming : sample;

  const renderStars = (n) => {
    const out = [];
    for (let i = 1; i <= 5; i++) {
      out.push(
        <img
          key={i}
          src={i <= n ? assets.star_icon : assets.star_dull_icon}
          alt={i <= n ? 'star' : 'star empty'}
          className="w-3 inline-block mr-0.5"
        />
      );
    }
    return out;
  };

  return (
    <section className="py-20">
      <div className="text-center mb-8">
        <div className='text-3xl mb-10'>
            <Title txt1={"WHAT CUSTOMER"} txt2={'SAYS'}/>
        </div>
        <p className="text-sm text-gray-500 mt-2">Real reviews from real customers</p>

        {/* Overall rating row */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">4.6</div>
            <div className="flex items-center">{renderStars(5).slice(0, 5)}</div>
          </div>
          <div className="text-sm text-gray-500">•</div>
          <div className="text-sm text-gray-500">Based on {reviews.length} reviews</div>
        </div>
      </div>

      {/* Reviews grid / horizontal on small screens */}
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article key={r.id} className="bg-white hover:scale-105 dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full text-white bg-[#0C586A] dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {r.avatar ? (
                    <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-white">{r.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-500">
                    {renderStars(r.rating)}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{r.text}</p>

              <div className="mt-4 flex items-center gap-3">
                <button className="px-3 py-1 text-xs border rounded text-gray-600 hover:bg-gray-50">Helpful</button>
                <button className="px-3 py-1 text-xs border rounded text-gray-600 hover:bg-gray-50">Report</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
