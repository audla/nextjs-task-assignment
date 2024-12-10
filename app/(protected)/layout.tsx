import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import SessionProvider from '@/components/SessionProvider'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  console.log(session)

  if(!session || session==null) {
   redirect('/login')
  }
  

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}

