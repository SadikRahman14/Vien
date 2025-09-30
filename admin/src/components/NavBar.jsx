import React from 'react'
import { assets } from "../assets/assets.js"
import { Link } from 'react-router-dom'


const NavBar = ({setToken}) => {
  return (
      <div className='flex items-center py-2 px-[4%] justify-between'>
         <Link to='/'>  
            <img src={assets.VIEN_ADMIN} className='w-36 cursor-pointer hover:-rotate-6 transition-all duration-500' alt="" /> 
         </Link> 
          <button onClick={() => setToken("")} className='bg-red-600 hover:bg-red-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'> Logoout </button>
    </div>
  )
}

export default NavBar