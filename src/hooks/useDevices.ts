import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchDevices, fetchDeviceById, removeDevice } from '@/api/devices'
import { useDeviceStore } from '@/store/deviceStore'
import toast from 'react-hot-toast'

export const useDevices = () => {
  const queryClient = useQueryClient()
  const { setDevices, setSelectedDevice } = useDeviceStore()

  const devicesQuery = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 30000,
    onSuccess: (data) => {
      setDevices(data)
    },
  })

  const removeDeviceMutation = useMutation({
    mutationFn: removeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      toast.success('Device removed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove device')
    },
  })

  return {
    devices: devicesQuery.data || [],
    isLoading: devicesQuery.isLoading,
    isError: devicesQuery.isError,
    error: devicesQuery.error,
    removeDevice: removeDeviceMutation.mutate,
    refetch: devicesQuery.refetch,
  }
}
