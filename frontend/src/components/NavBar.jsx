import React, { useState } from 'react'
import { assets} from "../assets/assets.js"
import { NavLink, Link } from 'react-router-dom'


const NavBar = () => {

    const [visible, setVisible] = useState(false);

  return (
    <div className='flex items-center justify-between py-4 font-medium'>
          <img src={assets.logo} className='w-36' alt="" />

          <ul className='hidden sm:flex gap-10 text-sm text-gray-700'>
              
              <NavLink to='/' className='flex flex-col items-center gap-1'>
                  <p>H O M E</p>
                  <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
              </NavLink>
              <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                  <p>C O L L E C T I O N</p>
                  <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
              </NavLink>
              <NavLink to='/about' className='flex flex-col items-center gap-1'>
                  <p>A B O U T</p>
                  <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
              </NavLink>
              <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                  <p>C O N T A C T</p>
                  <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
              </NavLink>
          </ul>  

          <div className='flex items-center gap-6'>
              <img src={assets.search_icon} className='w-5 cursor-pointer ' alt="" />
              
              <div className='group relative'>
                  <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                  <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                      <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                          <p className='cursor-pointer hover:text-black'> My Profile </p>
                          <p className='cursor-pointer hover:text-black'> Orders </p>
                          <p className='cursor-pointer hover:text-black'> Logout </p>
                      </div>

                  </div>
              </div>

              <Link to='/cart' className='relative'>
                  <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
                  <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center 
                        leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                      99
                  </p>
              </Link>

              <img onClick={() => setVisible(true)} src={ assets.menu_icon } alt="" className='w-5 cursor-pointer sm:hidden' />

          </div>

          <div className={`bg-slate-800 absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
              <div className='flex flex-col text-white'>
                  <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
                      <img src={assets.dropdown_icon} className='h-4 rotate-180 cursor-pointer' alt="" />
                      <p> B A C K </p>
                  </div>
                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/">
                        <span>H O M E</span>
                        <hr className="w-8 border-[1.5px] border-black rounded mt-1" />
                    </NavLink>

                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/collection">
                        <span>C O L L E C T I O N</span>
                        <hr className="w-8 border-[1.5px] border-black rounded mt-1" />
                    </NavLink>

                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/about">
                        <span>A B O U T</span>
                        <hr className="w-8 border-[1.5px] border-black rounded mt-1" />
                    </NavLink>

                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/contact">
                        <span>C O N T A C T</span>
                        <hr className="w-8 border-[1.5px] border-black rounded mt-1" />
                    </NavLink>

                  
                  
              </div>
          </div>
    </div>
  )
}

export default NavBar