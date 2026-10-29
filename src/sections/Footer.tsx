import { motion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, MAPS_SEARCH_URL, WHATSAPP_DISPLAY, whatsappLink } from '@/data'
import { InstagramIcon, Magnetic, Reveal, ScrollWord, WhatsAppIcon, spring } from '@/components/primitives'
import { Logo } from './Nav'

export default function Footer() {
  return (
    <footer id="contato" className="relative isolate overflow-hidden px-5 pb-10 pt-24 sm:px-8 sm:pt-36">
      <ScrollWord text="Ourocar Veículos · Ourocar Veículos ·" reverse className="bottom-24" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold/15 blur-[160px]" />
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-wide text-[10px] uppercase tracking-[0.35em] text-gold">Pronto para acelerar?</p>
        </Reveal>
        <motion.a
          href={whatsappLink('Olá, Ourocar! Vim pelo site e quero encontrar o meu próximo carro.')}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="group mt-4 block font-display text-[clamp(3rem,13vw,11rem)] font-black uppercase italic leading-[0.85] tracking-tight"
        >
          <span className="block transition-colors duration-500 group-hover:text-gold">Bora</span>
          <span className="text-gold-gradient flex items-center gap-4">
            negociar
            <ArrowUpRight className="size-[0.7em] text-gold transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-translate-y-3 group-hover:translate-x-3" />
          </span>
        </motion.a>

        <div className="gold-hairline mt-16" />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[14px] text-cream/50">Seu próximo carro está aqui! Compra, venda, troca e financiamento de veículos.</p>
          </div>
          <div>
            <p className="font-wide text-[9px] uppercase tracking-[0.3em] text-cream/40">WhatsApp</p>
            <Magnetic className="mt-4">
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-xl font-bold text-cream hover:text-gold">
                <WhatsAppIcon className="size-6 text-gold" /> {WHATSAPP_DISPLAY}
              </a>
            </Magnetic>
          </div>
          <div>
            <p className="font-wide text-[9px] uppercase tracking-[0.3em] text-cream/40">Instagram</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-3 text-[15px] font-semibold text-cream hover:text-gold">
              <InstagramIcon className="size-5 text-gold" /> {INSTAGRAM_HANDLE}
            </a>
          </div>
          <div>
            <p className="font-wide text-[9px] uppercase tracking-[0.3em] text-cream/40">Onde estamos</p>
            <a href={MAPS_SEARCH_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-start gap-3 text-[15px] font-semibold text-cream hover:text-gold">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                Ubá · Minas Gerais
                {/* PENDENTE: endereço completo e horários a confirmar com a loja */}
                <span className="mt-1 block text-[12px] font-normal text-cream/40">Buscar no Google Maps</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/5 pt-6 text-[12px] text-cream/35 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Ourocar Veículos · Ubá/MG</p>
          <p>Fotos do Instagram da loja. Disponibilidade, preços e condições sujeitos a confirmação.</p>
        </div>
      </div>
    </footer>
  )
}
