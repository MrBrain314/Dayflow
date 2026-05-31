'use client'

import Link from 'next/link'
import { Mail, PlayCircle } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }} className="mt-16">
      <div className="px-5 md:px-[10%] py-10">

        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Colonne 1 : Branding */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'var(--primary)' }}>D</div>
              <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                Day<span style={{ color: 'var(--primary)' }}>Flow</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs" style={{ color: 'var(--text-soft)' }}>
              Organise tes journées, suis tes tâches et écris ton journal personnel. Chaque jour compte.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Navigation
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { href: '/', label: "Aujourd'hui" },
                { href: '/history', label: 'Historique' },
                { href: '/journal', label: 'Journal' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="transition-colors"
                    style={{ color: 'var(--text-soft)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Réseaux sociaux */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Restons en contact
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="https://github.com/MrBrain314" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-soft)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}>
                  <FaGithub className="w-4 h-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/ouro-tagbabastou/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-soft)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}>
                  <FaLinkedin className="w-4 h-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:ourotagbabastouu@gmail.com"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-soft)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}>
                  <Mail className="w-4 h-4" /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Démo */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Voir l&apos;app en action
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
              Découvre Dayflow en vidéo avant de te lancer. Une démonstration complète de toutes les fonctionnalités.
            </p>
            <a href="https://drive.google.com/file/d/1Ai7_s7FvM_qy0Pr4COhcLAIJNXk1Dzyf/view?usp=drive_link"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:underline w-fit mt-1"
              style={{ color: 'var(--primary)' }}>
              <PlayCircle className="w-4 h-4" />
              Regarder la démo
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex justify-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-soft)' }}>
          <p>
            © {currentYear}{' '}
            <span className="font-semibold" style={{ color: 'var(--primary)' }}>DayFlow</span>
            {' '}- Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
