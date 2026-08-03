import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { generateClientLink } from '@/api/devices'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

export default function ClientLink() {
  const [linkData, setLinkData] = useState<{ link: string; qrCode: string } | null>(null)

  const generateMutation = useMutation({
    mutationFn: generateClientLink,
    onSuccess: (data) => {
      setLinkData(data)
      toast.success('Client link generated successfully')
    },
    onError: () => {
      toast.error('Failed to generate client link')
    },
  })

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Client Link</h1>
        <p className="text-gray-600 mt-1">Generate pairing link for client devices</p>
      </motion.div>

      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {!linkData ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Generate Client Link
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Create a secure pairing link for new client devices to connect
              </p>
              <button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {generateMutation.isPending ? 'Generating...' : 'Generate Link'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <QRCodeSVG
                    value={linkData.link}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pairing Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={linkData.link}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(linkData.link)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Link expires in 24 hours
                </p>
                <button
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Generate New Link
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-blue-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to connect a device
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Generate a pairing link using the button above</li>
            <li>2. Share the link or QR code with the client device</li>
            <li>3. On the client device, open the link in a browser</li>
            <li>4. Install and open the Family Monitoring Client app</li>
            <li>5. Accept the required permissions when prompted</li>
            <li>6. The device will appear in your device list once connected</li>
          </ol>
        </motion.div>
      </div>
    </div>
  )
}
