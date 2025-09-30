import axios from 'axios';
import React, { use } from 'react'
import { useState } from 'react'
import { backend_url } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => { 
        try {
            e.preventDefault();
            const response = await axios.post(backend_url + '/api/v1/users/admin-login', {
                email, password
            });
            console.log(response);

            if (response.data.success) {
                setToken(response.data.data.token);
            }
            else {
                toast.error(response.data.message);
            }


        } catch (error) {
            console.error(error);
        }
    }

  return (
      <div className='min-h-screen flex items-center justify-center w-full'>
          <div className='bg-white shadow-lg rounded-lg px-8 py-6 max-w-md'>
              
              <h1 className='flex items-center justify-center text-2xl font-bold mb-4'> Admin Panel</h1>
              <hr className="border-t-2 border-red-950 mb-5" />
              <form onSubmit={onSubmitHandler}>
                  <div className='mb-3 min-w-72'>
                      <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' />
                  </div>
                  <div className='mb-3 min-w-72'>
                      <p className='text-sm font-medium text-gray-700 mb-2'> Password</p>
                      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' />
                  </div>
                  <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'> L O G I N </button>
              </form>
          </div>
    </div>
  )
}

export default Login