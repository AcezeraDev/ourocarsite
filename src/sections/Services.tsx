import { ArrowUpRight } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'
import { BorderBeam } from '@/components/ui/border-beam'
import { services, whatsappLink } from '@/data'
import { Eyebrow, Parallax, Reveal, ScrollWord, SplitHeading, TiltCard, useIsMobile } from '@/components/primitives'

const ticker = ['Compra', 'Venda', 'Troca', 'Financiamento', 'Ubá · MG', 'Seu próximo carro está aqui']

export function GoldTicker() {
  return (
    <div className="relative z-10 -rotate-2 border-y border-black/20 bg-gold py-3 text-black shadow-[0_0_80px_-10px_rgba(246,216,70,0.55)] sm:py-4">
      <Marquee className="[--duration:28s] [--gap:2.5rem]" repeat={4}>
        {ticker.map((t) => (
          <span key={t} className="flex items-center gap-10 font-display text-2xl font-black uppercase italic tracking-tight sm:text-4xl">
            {t}
            <svg viewBox="0 0 24 24" className="size-5 sm:size-6" aria-hidden>
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </Marquee>
    </div>
  )
}

export default function Services() {
  const mobile = useIsMobile(1024)
  return (
    <section id="servicos" className="relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-36">
      <ScrollWord text="Compra · Venda · Troca · Financia ·" className="top-24" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>O que fazemos</Eyebrow>
            </Reveal>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6.5vw,5.5rem)] font-extrabold uppercase italic leading-[0.9]">
              <SplitHeading text="Quatro jeitos de" />
              <br />
              <SplitHeading text="fechar negócio." className="text-gold-gradient" delay={0.2} />
            </h2>
          </div>
          <Reveal delay={0.2} className="max-w-sm text-cream/60">
            Do primeiro contato à entrega da chave, o atendimento é direto pelo WhatsApp. Escolha o que você precisa e fale com a equipe.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <Parallax speed={mobile ? 0 : [0.04, 0.12, 0.06, 0.14][i]} className="h-full">
              <TiltCard className="group h-full rounded-[28px]">
                <a
                  href={whatsappLink(s.message)}
                  target="_blank"
                  rel="noreferrer"
                  className="glass relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[28px] p-6 sm:min-h-[360px] sm:p-7"
                >
                  <div className="flex items-start justify-between [transform:translateZ(40px)]">
                    <img src={s.cover} alt="" width={64} height={64} loading="lazy" className="size-14 rounded-full ring-2 ring-gold/50 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:rotate-[-12deg] group-hover:scale-110 sm:size-16" />
                    <span className="font-wide text-[11px] text-cream/35">{s.kicker}</span>
                  </div>
                  <div className="mt-auto [transform:translateZ(60px)]">
                    <h3 className="font-display text-4xl font-black uppercase italic sm:text-[2.6rem]">{s.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-cream/60">{s.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-gold">
                      Chamar no WhatsApp
                      <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </span>
                  </div>
                  <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-6 font-display text-[9rem] font-black italic leading-none text-white/[0.03]">
                    {s.kicker}
                  </span>
                  <BorderBeam size={140} duration={9} delay={i * 1.5} colorFrom="#f6d846" colorTo="#f5a300" />
                </a>
              </TiltCard>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
