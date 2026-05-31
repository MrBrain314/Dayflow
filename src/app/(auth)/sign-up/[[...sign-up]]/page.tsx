import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-6 w-full px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow)' }}>D</div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Rejoins Day<span style={{ color: 'var(--primary)' }}>Flow</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Commence à organiser tes journées.</p>
        </div>
        <SignUp appearance={{ variables: { colorPrimary: '#f87777', colorBackground: '#f7f4ef', colorText: '#2c1810', colorInputBackground: '#fdfcf9', colorInputText: '#2c1810', borderRadius: '0.875rem' } }} />
        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
          Déjà un compte ?{' '}
          <Link href="/sign-in" className="font-semibold" style={{ color: 'var(--primary)' }}>Se connecter →</Link>
        </p>
      </div>
    </main>
  )
}
