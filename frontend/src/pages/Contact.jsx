import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="bg-white dark:bg-gray-900"> {/* page bg to unify */}
      <div className='text-center text-3xl pt-10 border-t border-gray-200 dark:border-white/10'>
        <Title txt1={'CONTACT'} txt2={'US'} />
      </div>

      {/* centered card wrapper to lift off the dark page */}
      <div className="max-w-6xl mx-auto px-4">
        <div className='my-10 md:my-12 mb-28 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-800/70 shadow-lg backdrop-blur-[2px]'>
          <div className='flex flex-col justify-center md:flex-row gap-10 p-6 md:p-10'>
            <img
              src={assets.contact_img}
              alt=""
              className='w-full md:max-w-[480px] rounded-xl shadow-md'
            />

            <div className='flex flex-col justify-center items-start gap-6'>
              <p className='font-semibold text-xl text-gray-700 dark:text-gray-200'> OUR STORE </p>
              <p className='text-gray-600 dark:text-gray-300'>
                15/315 Modhubagh, Hatirjheel
              </p>
              <p className='text-gray-600 dark:text-gray-300'>
                Tel: +880 18629 37424 <br /> Email: sadik.nai.008@gmail.com
              </p>

              <p className='font-semibold text-xl text-gray-700 dark:text-gray-200'>
                Careers at <span className='text-green-600'>VIEN</span>
              </p>
              <p className='text-gray-600 dark:text-gray-300'>
                Learn More About Job Openings and Our Teams
              </p>

              <button className='border border-gray-800/80 dark:border-white/20 px-8 py-4 text-sm rounded-lg hover:bg-gray-800/90 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-all duration-300'>
                Explore Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default Contact
