import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    screenshotInterval: 30,
    locationInterval: 60,
    maxScreenshots: 1000,
    autoDeleteDays: 30,
    notificationsEnabled: true,
    emailAlerts: false,
  })

  const handleSave = () => {
    // In production, save to API
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure monitoring preferences</p>
      </motion.div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 space-y-8">
            {/* Monitoring Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshot Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.screenshotInterval}
                    onChange={(e) => setSettings({ ...settings, screenshotInterval: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="10"
                    max="300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How often to capture screenshots (10-300 seconds)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Update Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.locationInterval}
                    onChange={(e) => setSettings({ ...settings, locationInterval: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="30"
                    max="600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How often to update device location (30-600 seconds)
                  </p>
                </div>
              </div>
            </div>

            {/* Storage Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Screenshots per Device
                  </label>
                  <input
                    type="number"
                    value={settings.maxScreenshots}
                    onChange={(e) => setSettings({ ...settings, maxScreenshots: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-delete after (days)
                  </label>
                  <input
                    type="number"
                    value={settings.autoDeleteDays}
                    onChange={(e) => setSettings({ ...settings, autoDeleteDays: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="365"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically delete data older than specified days
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Alerts</p>
                    <p className="text-xs text-gray-500">Receive email for critical events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
