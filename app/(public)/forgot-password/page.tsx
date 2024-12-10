import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ForgotPasswordForm from './ForgotPasswordForm'

export default function ForgotPassword() {
  return (
    <main className="py-10 max-w-md mx-auto">
      <Card className='bg-gray-300/20 backdrop-blur-md shadow-xl dark:bg-gray-900 border-transparent'>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}