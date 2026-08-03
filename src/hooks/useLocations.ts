import { useQuery } from '@tanstack/react-query'
import { fetchLocations, fetchLocationHistory } from '@/api/locations'

export const useLocations = (deviceId: string | null) => {
  const liveLocationQuery = useQuery({
    queryKey: ['liveLocation', deviceId],
    queryFn: () => fetchLocations(deviceId!),
    enabled: !!deviceId,
    refetchInterval: 10000,
  })

  const historyQuery = (startDate?: string, endDate?: string) =>
    useQuery({
      queryKey: ['locationHistory', deviceId, startDate, endDate],
      queryFn: () =>
        fetchLocationHistory(deviceId!, { startDate, endDate }),
      enabled: !!deviceId && !!startDate && !!endDate,
    })

  return {
    liveLocation: liveLocationQuery.data?.[0],
    isLoading: liveLocationQuery.isLoading,
    isError: liveLocationQuery.isError,
    historyQuery,
  }
}
