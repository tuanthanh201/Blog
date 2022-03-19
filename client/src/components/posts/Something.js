import { useSubscription } from '@apollo/client'
import { useEffect } from 'react'
import { POSTS_FETCHED, POST_CREATED, NEW_NOTIFICATION } from '../../graphql'
import useUser from '../../hooks/useUser'

const Something = () => {
  const { loading, user } = useUser()
  const payload = useSubscription(NEW_NOTIFICATION, {variables: {userId: user?.id}})

  console.log(payload)

  return null
}

export default Something
