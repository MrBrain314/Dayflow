'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton, useUser, useAuth } from '@clerk/nextjs'
import { LayoutDashboard, History, BookOpen, LogIn } from 'lucide-react'

const links = [
  { href: '/', label: "Aujourd'hui", icon: LayoutDashboard },
  { href: '/history', label: 'Historique', icon: History },
  { href: '/journal', label: 'Journal', icon: BookOpen },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { isSignedIn } = useAuth()

  return (
    <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'var(--primary)' }}>D</div>
          <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            Day<span style={{ color: 'var(--primary)' }}>Flow</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: active ? 'var(--primary)' : 'var(--text-soft)',
                  background: active ? 'var(--primary-soft)' : 'transparent',
                  border: active ? '1px solid var(--primary-border)' : '1px solid transparent',
                }}>
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              {user && (
                <span className="text-sm hidden md:block" style={{ color: 'var(--text-soft)' }}>
                  {user.firstName ?? user.emailAddresses[0]?.emailAddress}
                </span>
              )}
              <UserButton />
            </>
          ) : (
            <>
              <button onClick={() => router.push('/sign-in')}
                className="px-3 py-1.5 rounded-xl text-sm font-medium"
                style={{ color: 'var(--text-soft)', border: '1px solid var(--border)' }}>
                Connexion
              </button>
              <button onClick={() => router.push('/sign-up')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--green)' }}>
                <LogIn size={13} /> S&apos;inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
