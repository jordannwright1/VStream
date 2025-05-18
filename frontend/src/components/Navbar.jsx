import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import { logout } from '../lib/api';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const {mutate: logoutMutation} = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]}),
  });


  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className={`md:hidden absolute top-[65px] left-0 w-full bg-[#03001417] backdrop-blur-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col items-center py-4 space-y-4">
            <a href="/" className='text-gray-400 hover:text-white' onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="/notifications" className='text-gray-400 hover:text-white' onClick={() => setIsMenuOpen(false)}>Notifications</a>
            <a href="/friends" className='text-gray-400 hover:text-white' onClick={() => setIsMenuOpen(false)}>Friends</a>
          </div>
        </div>
          
          {isChatPage && (
            <div className="pl-5">
              <Link to='/' className='flex items-center gap-2.5'>
                <ShipWheelIcon className='size-9 text-primary' />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  VStream
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link
            to='/notifications'
            >
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User avatar" rel='noreferrer' />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
