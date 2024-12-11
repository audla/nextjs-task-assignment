'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/catalyst/button'
import { Input } from '@/components/catalyst/input'
import { updatePassword } from '@/actions/resetPassword'

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter() // Next.js router for navigation
  const [parentId, setParentId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecovered, setIsRecovered] = useState(false)

  useEffect(() => {
    const recoverAccount = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()
        if (result.success) {
          setIsRecovered(true)
          setParentId(result.parentId)
          setMessage(result.message)
        } else {
          setError(result.message)
        }
      } catch {
        setError('Error recovering account. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    recoverAccount()
  }, [token])

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const result = await updatePassword(parentId, password)
      if (result.success) {
        // Redirect immediately after a successful update
        router.replace('/dashboard') // Use replace to avoid adding to browser history
      } else {
        setError(result.message)
      }
    } catch {
      setError('An unexpected error occurred. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Processing your request...</div>
  }

  if (error && !isRecovered) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button>
          <Link href="/forgot-password" className="text-blue-500 hover:underline">
            Request a new password reset
          </Link>
        </Button>
      </div>
    )
  }

  if (!isRecovered) {
    return (
      <div className="text-center">
        <p>Unable to recover account. Please try again or request a new password reset.</p>
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Request a new password reset
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          minLength={8}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <Input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          minLength={8}
        />
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Updating Password...' : 'Update Password'}
      </Button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
