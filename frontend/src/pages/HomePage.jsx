import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getOutgoingFriendRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}



const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())
  
  const {data:friends=[], isLoading:loadingFriends} = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  })

  const {data:recommendedUsers=[], isLoading:loadingUsers} = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers,
  })

  const {data:outgoingFriendRequests=[]} = useQuery({
    queryKey: ['outgoingFriendQuests'],
    queryFn: getOutgoingFriendRequests,
  })

  const {mutate:sendRequestMutation, isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["outgoingFriendRequests"]}),
  })
  
  useEffect(() => {
    const outgoingIds = new Set();
    if(outgoingFriendRequests && outgoingFriendRequests.length > 0) {
      outgoingFriendRequests.forEach((req) => {
        console.log(req)
        outgoingIds.add(req.recipient._id);
      })

      try {
        setOutgoingRequestsIds(new Set(outgoingIds));
      } catch (error) {
        console.error('Problem setting outgoing ids:', error.message, error);
      }
      
    }
  }, [outgoingFriendRequests])
  
  return (
    <div>
      <div className="container mx-auto space-y-10 px-4">
        <div className="flex justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (<div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6">
            <div className="flex flex-col justify-between gap-4 items-start sm:items-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70">
                Discover language partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card">
              <h3 className="font-semibold">No Recommendations Available</h3>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 '>
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds?.has(user._id);

                return (
                  <div key={user._id}
                  className='bg-base-200 hover:shadow-lg transition-all duration-300'
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex">
                              <MapPinIcon className='flex items-center text-xs opacity-70 mb-1 mr-1' />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-accent">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
        
      </div>
    </div>
  )
}

export default HomePage
