import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchScreenshots } from '@/api/screenshots'

export const useScreenshots = (deviceId?: string) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['screenshots', deviceId],
    queryFn: ({ pageParam = 1 }) =>
      fetchScreenshots({
        deviceId,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  })

  const screenshots = data?.pages.flatMap((page) => page.data) || []

  return {
    screenshots,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  }
}
