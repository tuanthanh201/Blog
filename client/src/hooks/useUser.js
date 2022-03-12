import { useQuery } from '@apollo/client'
import { GET_ME } from '../graphql'

const useUser = () => {
  const { loading, data } = useQuery(GET_ME)
  return { loading, user: data?.getMe }
}

export default useUser
