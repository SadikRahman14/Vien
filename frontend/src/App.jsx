// App.jsx
import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ThemeToggle from './components/ThemeToggle';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RequireAuth from './components/RequireAuth';

import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrders from './pages/PlaceOrders';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

const App = () => {
  return (
    <div className='bg-gray-100 dark:bg-slate-600 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />

        {/* public login */}
        <Route path='/login' element={<Login />} />

        {/* protected routes */}
        <Route
          path='/cart'
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path='/place-order'
          element={
            <RequireAuth>
              <PlaceOrders />
            </RequireAuth>
          }
        />
        <Route
          path='/orders'
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path='/profile'
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* fallback: redirect unknown routes to home (or a NotFound page) */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Footer />
      <ThemeToggle />
    </div>
  );
};

export default App;
