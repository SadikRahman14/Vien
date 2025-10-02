import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className=''>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.vien} className='hover:scale-90 mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum inventore, voluptas, ex odio accusantium dolorum excepturi rerum sed! Veniam exercitationem fuga cum?
          </p>
        </div> 

        <div>
          <p className='text-xl font-medium mb-5 hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'>
            C O M P A N Y
          </p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <NavLink 
                to="/home" 
                className='hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'
              >
                H O M E
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/collection" 
                className='hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'
              >
                C O L L E C T I O N
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/delivery" 
                className='hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'
              >
                D E L I V E R Y
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className='hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'
              >
                C O N T A C T
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div>
          <p className='text-xl font-medium mb-5 hover:tracking-normal tracking-widest transition-all duration-300 cursor-pointer'>
            G E T  I N  T O U C H
          </p>
          <ul className='flex flex-col gap-1 text-gray-400'>
            <li className='hover:text-black cursor-pointer'>01862937424</li>
            <li className='hover:text-black cursor-pointer'>vien@forever.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className='bg-black'/>
        <p className='py-5 text-sm text-center'>Copyright 2025@SadikRahman14 - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
