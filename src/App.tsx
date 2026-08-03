import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import LoadingScreen from '@/components/common/LoadingScreen'
import Layout from '@/components/layout/Layout'

// Lazy load pages
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Devices = lazy(() => import('@/pages/Devices'))
const Monitoring = lazy(() => import('@/pages/Monitoring'))
const Screenshots = lazy(() => import('@/pages/Screenshots'))
const ScreenTime = lazy(() => import('@/pages/ScreenTime'))
const Location = lazy(() => import('@/pages/Location'))
const Activity = lazy(() => import('@/pages/Activity'))
const Security = lazy(() => import('@/pages/Security'))
const Notifications = lazy(() => import('@/pages/Notifications'))
const Account = lazy(() => import('@/pages/Account'))
const Settings = lazy(() => import('@/pages/Settings'))
const ClientLink = lazy(() => import('@/pages/ClientLink'))

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="screenshots" element={<Screenshots />} />
            <Route path="screen-time" element={<ScreenTime />} />
            <Route path="location" element={<Location />} />
            <Route path="activity" element={<Activity />} />
            <Route path="security" element={<Security />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="account" element={<Account />} />
            <Route path="settings" element={<Settings />} />
            <Route path="client-link" element={<ClientLink />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
