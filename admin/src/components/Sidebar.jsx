import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
      
        
      <div className='w-[18%] min-h-screen border-r-2'>
          <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
              
              <NavLink className='hover:bg-[#0C586A] hover:text-white transition-all duration-500 flex items-center gap-3 border border-[#0C586A] border-r-0 px-3 py-2 rounded-1'
                to="/add"
              >
                  <img src={assets.add_icon} className='w-5 h-5' alt="" />
                  <p className='hidden md:block' > Add Items </p>
              </NavLink>

              <NavLink className='hover:bg-[#0C586A] hover:text-white transition-all duration-500 flex items-center gap-3 border border-[#0C586A] border-r-0 px-3 py-2 rounded-1'
                to="/list"
              >
                  <img src={assets.parcel_icon} className='w-5 h-5' alt="" />
                  <p className='hidden md:block' > List Items </p>
              </NavLink>

              <NavLink className='hover:bg-[#0C586A] hover:text-white transition-all duration-500 flex items-center gap-3 border border-[#0C586A] border-r-0 px-3 py-2 rounded-1'
                to="/orders"
              >
                  <img src={assets.order_icon} className='w-5 h-5' alt="" />
                  <p className='hidden md:block' > Orders </p>
              </NavLink>
          </div>

    </div>
  )
}

export default Sidebar