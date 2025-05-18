import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <div className='px-10 py-2 flex items-center justify-end w-full absolute'>
      <button onClick={handleVideoCall} className='btn btn-primary btn-sm text-white'>
        <VideoIcon className='size-6' />
      </button>
    </div>
  )
}

export default CallButton
