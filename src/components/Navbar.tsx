'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton, useUser, useAuth } from '@clerk/nextjs'
import { LayoutDashboard, History, BookOpen, LogIn, Menu, X } from 'lucide-react'

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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'var(--primary)' }}>D</div>
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Day<span style={{ color: 'var(--primary)' }}>Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
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
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {isSignedIn ? (
              <>
                {user && (
                  <span className="text-sm" style={{ color: 'var(--text-soft)' }}>
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

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            {isSignedIn && <UserButton />}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 right-0 p-4 flex flex-col gap-2"
            style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            onClick={e => e.stopPropagation()}>

            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: active ? 'var(--primary)' : 'var(--text)',
                    background: active ? 'var(--primary-soft)' : 'var(--surface)',
                    border: active ? '1px solid var(--primary-border)' : '1px solid var(--border)',
                  }}>
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}

            {!isSignedIn && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => { router.push('/sign-in'); setMenuOpen(false) }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ color: 'var(--text)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  Connexion
                </button>
                <button onClick={() => { router.push('/sign-up'); setMenuOpen(false) }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'var(--green)' }}>
                  <LogIn size={14} /> S&apos;inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
