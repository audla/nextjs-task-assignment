'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import AudlaLogo from './logo'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-100 py-4 shadow-md print:shadow-none">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <AudlaLogo className="h-8 w-auto" />
            <h1 className="text-2xl font-bold text-gray-800 sr-only">Audla Assignment App</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/assignments"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Assignments
            </Link>
            {status === 'loading' ? (
              <Button disabled variant="outline">Loading...</Button>
            ) : session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Signed in as {session.user.email}</span>
                <Button onClick={() => signOut()} variant="outline">Sign out</Button>
              </div>
            ) : (
              <Button onClick={() => signIn()} variant="outline">Sign in</Button>
            )}
          </nav>
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 flex flex-col gap-4 md:hidden">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/assignments"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Assignments
            </Link>
            {status === 'loading' ? (
              <Button disabled variant="outline">Loading...</Button>
            ) : session?.user ? (
              <div className="flex flex-col gap-4">
                <span className="text-gray-600">Signed in as {session.user.email}</span>
                <Button onClick={() => signOut()} variant="outline">Sign out</Button>
              </div>
            ) : (
              <Button onClick={() => signIn()} variant="outline">Sign in</Button>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

