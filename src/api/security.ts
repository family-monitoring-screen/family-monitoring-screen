import apiClient from './axios'

export const fetchSessions = async () => {
  const { data } = await apiClient.get('/security/sessions')
  return data.data
}

export const fetchSecurityLog = async () => {
  const { data } = await apiClient.get('/security/log')
  return data.data
}

export const terminateSession = async (sessionId: string) => {
  await apiClient.delete(`/security/sessions/${sessionId}`)
}

export const enable2FA = async () => {
  const { data } = await apiClient.post('/security/2fa/enable')
  return data.data
}

export const verify2FA = async (code: string) => {
  const { data } = await apiClient.post('/security/2fa/verify', { code })
  return data.data
}
