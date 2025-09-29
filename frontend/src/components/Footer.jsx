import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
      <div className='hover:bg-gray-200'>
          <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
              <img src={assets.vien} className='mb-5 w-32' alt="" />
              <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum inventore, voluptas, ex odio accusantium dolorum excepturi rerum sed! Veniam exercitationem fuga cum?
              </p>
            </div> 
          

          <div>
              <p className='text-xl font-medium mb-5'> C O M P A N Y</p>
              <ul className='flex flex-col gap-1 text-gray-600'>
                  <li> H O M E </li>
                  <li> A B O U T  U S </li>
                  <li> D E L I V E R Y</li>
                  <li> P R I V A C Y  P O L I C Y </li>
              </ul>
              </div>
              
              <div>
                  <p className='text-xl font-medium mb-5'> GET IN TOUCH </p>
                  <ul className='flex flex-col gap-1 text-gray-400'>
                      <li className=' hover:text-black'> 01862937424 </li>
                      <li className=' hover:text-black'> vien@forever.com </li>
                  </ul>
              </div>
          </div>
          <div>
              <hr className='bg-black'/>
              <p className='py-5 text-sm text-center'>  Copyright 2025@SadikRahman14 - All Rights Reserved </p>
          </div>

    </div>
  )
}

export default Footer