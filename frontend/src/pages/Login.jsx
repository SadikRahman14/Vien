import React, { useState } from 'react'
import Title from '../components/Title'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  
  const onSubmitHandler = async (event) => { 
    event.preventDefault();
  }


  const showName = currentState === 'Signup'

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 mb-10 text-gray-700">
      <div className="text-3xl font-medium">
        <Title txt1={currentState} />
      </div>


      <div
        className={[
          'w-full overflow-hidden transition-all duration-500 ease-in-out will-change-transform',
          showName ? 'max-h-20 opacity-100 scale-100 mt-0' : 'max-h-0 opacity-0 scale-95 -mt-2',
        ].join(' ')}
        aria-hidden={!showName}
      >
        <input
          type="text"
          className="rounded-lg w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          tabIndex={showName ? 0 : -1}
        />
      </div>

      <input
        type="email"
        className="rounded-lg w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        type="password"
        className="rounded-lg w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>
        {currentState === 'Login' ? (
          <p className="cursor-pointer" onClick={() => setCurrentState('Signup')}>
            Create Account
          </p>
        ) : (
          <p className="cursor-pointer" onClick={() => setCurrentState('Login')}>
            Login Here
          </p>
        )}
      </div>
      <button className='bg-[#eab3a8] hover:bg-[#fcbfb7]  text-black font-light px-8 py-2 mt-4'> { currentState === 'Login' ? 'L O G I N' : 'S I G N U P'}</button>
    </form>
  )
}

export default Login
