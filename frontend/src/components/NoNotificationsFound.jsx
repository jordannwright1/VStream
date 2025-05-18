import { BellIcon } from 'lucide-react'
import React from 'react'

const NoNotificationsFound = () => {
  return (
    <div className='flex flex-col justify-center text-center py-16 items-center'>
      <div className="mb-5">
        <BellIcon />
      </div> 
      <h1 className='font-semibold text-xl'>No Notifications Yet</h1>
      <p className='text-sm mt-3'>When you have new notifications, they will appear here</p>
    </div>
  )
}

export default NoNotificationsFound
