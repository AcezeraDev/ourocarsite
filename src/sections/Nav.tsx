import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { whatsappLink } from '@/data'
import { WhatsAppIcon, spring } from '@/components/primitives'
import { cn } from '@/lib/utils'

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#showroom', label: 'Showroom' },
  { href: '#loja', label: 'A loja' },
  { href: '#simular', label: 'Troca & Financiamento' },
  { href: '#contato', label: 'Contato' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#inicio" className={cn('group flex items-center gap-3', className)} aria-label="Ourocar Veículos — início">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-full ring-1 ring-gold/40 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110">
        <img src="/ourocar/logo.jpg" alt="" width={40} height={40} className="size-full scale-[1.35] object-cover" />
      </span>
      <span className="leading-none">
        <span className="block font-wide text-[13px] tracking-[0.32em] text-cream">OUROCAR</span>
        <span className="mt-1 block font-wide text-[8px] tracking-[0.5em] text-gold">VEÍCULOS · UBÁ</span>
      </span>
    </a>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
      >
        <nav
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 pl-3 transition-all duration-500 sm:px-4 sm:pl-4',
            scrolled ? 'glass' : 'bg-transparent',
          )}
        >
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-full px-4 py-2 text-[13px] font-medium text-cream/70 transition-colors hover:text-cream after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={whatsappLink('Olá, Ourocar! Vim pelo site e gostaria de atendimento.')}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[13px] font-bold text-black shadow-[0_0_30px_-6px_rgba(246,216,70,0.7)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-105 sm:inline-flex"
            >
              <WhatsAppIcon className="size-4" /> Falar agora
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-white/10 text-cream lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 px-6 pb-10 pt-6 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ clipPath: 'circle(150% at 92% 6%)' }}
            exit={{ clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-white/10" aria-label="Fechar menu">
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-14 flex flex-1 flex-col gap-2">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.15 + i * 0.06 }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-white/5 py-4 font-display text-4xl font-extrabold italic uppercase text-cream">
                    <span className="font-wide text-[10px] not-italic text-gold">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={whatsappLink('Olá, Ourocar! Vim pelo site e gostaria de atendimento.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 rounded-full bg-gold py-4 font-bold text-black"
            >
              <WhatsAppIcon className="size-5" /> Chamar no WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
