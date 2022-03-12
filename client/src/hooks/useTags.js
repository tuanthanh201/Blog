import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_TAGS } from '../graphql'

const useTags = () => {
  const { loading, data } = useQuery(GET_ALL_TAGS)

  return {
    loading,
    tags: useMemo(
      () =>
        data?.findAllTags?.map((tag) => ({
          key: tag.id,
          text: tag.content,
          value: tag.content,
        })),
      [data?.findAllTags]
    ),
  }
}

export default useTags
