import React, { useContext, useState } from 'react'
import { assets } from "../assets/assets.js"
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx';
import AlertBox from './AlertBox.jsx';

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const { search, setSearch, showSearch, setShowSearch, getCartCount, token, logout } = useContext(ShopContext);
    const [showAlert, setShowAlert] = useState(false);

    const handleConfirmLogout = async () => {
        try {
            // call logout (await so we can clear UI after server finishes)
            await logout();
        } catch (e) {
            // optional: show toast or console
            console.error('Logout failed', e);
        } finally {
            setShowAlert(false);
        }
    };

    return (
        <div className='dark:bg-black flex items-center justify-between py-4 font-medium'>
            <Link to='/'>
                <img src={assets.vien} className='w-36 cursor-pointer hover:-rotate-6 transition-all duration-500' alt="" />
            </Link>

            <ul className='hidden sm:flex gap-10 text-sm text-gray-700 dark:text-gray-300'>
                <NavLink to='/' className='transition-all duration-500'>
                    {({ isActive }) => (
                        <div className={`hover:-rotate-6 transition-all duration-500 flex flex-col items-center gap-1 ${isActive ? 'text-[#0C586A]' : ''}`}>
                            <p>H O M E</p>
                            <hr className={`${isActive ? 'w-2/4' : 'w-2/4 hidden'} border-none h-[1.5px] bg-[#0C586A] dark:bg-gray-300`} />
                        </div>
                    )}
                </NavLink>

                <NavLink to='/collection' className='transition-all duration-500'>
                    {({ isActive }) => (
                        <div className={`hover:-rotate-6 transition-all duration-500 flex flex-col items-center gap-1 ${isActive ? 'text-[#0C586A]' : ''}`}>
                            <p>C O L L E C T I O N</p>
                            <hr className={`${isActive ? 'w-2/4' : 'w-2/4 hidden'} border-none h-[1.5px] bg-[#0C586A] dark:bg-gray-300`} />
                        </div>
                    )}
                </NavLink>

                <NavLink to='/about' className='transition-all duration-500'>
                    {({ isActive }) => (
                        <div className={`hover:-rotate-6 transition-all duration-500 flex flex-col items-center gap-1 ${isActive ? 'text-[#0C586A]' : ''}`}>
                            <p>A B O U T</p>
                            <hr className={`${isActive ? 'w-2/4' : 'w-2/4 hidden'} border-none h-[1.5px] bg-[#0C586A] dark:bg-gray-300`} />
                        </div>
                    )}
                </NavLink>

                <NavLink to='/contact' className='transition-all duration-500'>
                    {({ isActive }) => (
                        <div className={`hover:-rotate-6 transition-all duration-500 flex flex-col items-center gap-1 ${isActive ? 'text-[#0C586A]' : ''}`}>
                            <p>C O N T A C T</p>
                            <hr className={`${isActive ? 'w-2/4' : 'w-2/4 hidden'} border-none h-[1.5px] bg-[#0C586A] dark:bg-gray-300`} />
                        </div>
                    )}
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(!showSearch)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

                <div className='group relative'>
                    <Link to='/login'>
                        <img className='hover:-rotate-12 transition-all duration-500 w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    </Link>

                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded'>
                            {!token ? <NavLink to='/login' className='cursor-pointer hover:text-black dark:hover:text-white'> Login </NavLink> : null}
                            {token ? <NavLink to='/profile' className='cursor-pointer hover:text-black dark:hover:text-white'> My Profile </NavLink> : null}
                            {token ? <p className='cursor-pointer hover:text-black dark:hover:text-white'> Orders </p> : null}
                            {token ? <p onClick={() => setShowAlert(true)} className='rounded-lg cursor-pointer text-red-600 dark:hover:text-white'> Logout </p> : null}
                        </div>
                    </div>
                </div>

                {/* AlertBox moved here so it's not nested inside dropdown and overlays safely */}
                <AlertBox
                    show={showAlert}
                    text="Logging out will clear your cart. Are you sure?"
                    confirmText="Log out"
                    cancelText="Cancel"
                    onConfirm={handleConfirmLogout}
                    onCancel={() => setShowAlert(false)}
                />

                {token ? (
                    <Link to='/cart' className='relative'>
                        <img src={assets.cart_icon} alt="" className='hover:-rotate-12 transition-all duration-500 w-5 min-w-5' />
                        {getCartCount() > 0 ? (
                            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black dark:bg-white text-white dark:text-black aspect-square rounded-full text-[8px]'>
                                {getCartCount()}
                            </p>
                        ) : null}
                    </Link>
                ) : null}

                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
            </div>

            <div className={`bg-slate-700 dark:bg-gray-900 absolute top-0 right-0 bottom-0 overflow-hidden transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-white dark:text-gray-200'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180 cursor-pointer' alt="" />
                        <p> B A C K </p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/"> <span>H O M E</span> </NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/collection"> <span>C O L L E C T I O N</span> </NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/about"> <span>A B O U T</span> </NavLink>
                    <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 relative flex flex-col items-start" to="/contact"> <span>C O N T A C T</span> </NavLink>
                </div>
            </div>
        </div>
    )
}

export default NavBar
