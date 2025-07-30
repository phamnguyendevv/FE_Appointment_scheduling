"use client"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
          <p className="text-gray-600">
            Your provider account is currently under review by our admin team. You'll receive an email notification once
            your account is approved.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Admin reviews your application</li>
            <li>• You'll receive email notification</li>
            <li>• Access granted within 24-48 hours</li>
          </ul>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}
