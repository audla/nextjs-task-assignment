import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
interface ResetPasswordSearchParams {
  code?: string;
}

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<ResetPasswordSearchParams>
}) {
  const {code:token} = await searchParams;

  return (
    <main className='py-10 max-w-md mx-auto'>
      <Card className='bg-gray-300/20 backdrop-blur-md shadow-xl dark:bg-gray-900 border-transparent'>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <p className="text-red-500">No recovery token found in the URL.</p>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}