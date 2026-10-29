import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Marquee } from '@/components/ui/marquee'
import { deliveries, highlights, storefront } from '@/data'
import { Eyebrow, Reveal, ScrollWord, SplitHeading } from '@/components/primitives'

export default function Store() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 120])
  const clip = useTransform(scrollYProgress, [0.05, 0.35], ['inset(18% 12% 18% 12% round 40px)', 'inset(0% 0% 0% 0% round 28px)'])

  return (
    <section ref={ref} id="loja" className="relative isolate overflow-x-clip py-24 sm:py-36">
      <ScrollWord text="A loja · Ubá · MG ·" className="top-10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>A loja</Eyebrow>
            </Reveal>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase italic leading-[0.9]">
              <SplitHeading text="Vem conhecer" />
              <br />
              <SplitHeading text="a Ourocar." className="text-gold-gradient" delay={0.15} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-cream/65">
                Showroom coberto, carros expostos com cuidado e uma equipe que entrega cada chave pessoalmente. Fica em Ubá, Minas Gerais — chame no
                WhatsApp para combinar sua visita.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <p className="font-wide text-[10px] uppercase tracking-[0.3em] text-cream/40">Destaques do Instagram</p>
              <ul className="hide-scrollbar -mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2">
                {highlights.map((h, i) => (
                  <motion.li
                    key={h.label}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.05 }}
                    className="shrink-0"
                  >
                    <a href={h.href} target="_blank" rel="noreferrer" className="group flex w-[68px] flex-col items-center gap-2 text-center">
                      <span className="rounded-full bg-gradient-to-tr from-amber via-gold to-amber p-[2px] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:rotate-6">
                        <img src={h.cover} alt="" width={64} height={64} loading="lazy" className="size-16 rounded-full border-2 border-ink" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase leading-tight text-cream/70">{h.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <motion.figure style={{ clipPath: clip }} className="col-span-2 overflow-hidden rounded-[28px]">
              <img src="/ourocar/fotos/02-foto-publicacao.jpg" alt="Interior do showroom da Ourocar com quadros de carros e o logo na parede" width={640} height={480} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </motion.figure>
            {storefront.map((s, i) => (
              <motion.figure key={s.src} style={{ y: i === 0 ? y1 : y2 }} className="overflow-hidden rounded-[24px] border border-white/10">
                <img src={s.src} alt={s.alt} width={360} height={640} loading="lazy" className="aspect-[9/14] w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 sm:mt-36">
        <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between px-5 sm:px-8">
          <h3 className="font-display text-3xl font-black uppercase italic sm:text-5xl">
            Chave na mão, <span className="text-gold">sorriso no rosto.</span>
          </h3>
        </div>
        <Marquee pauseOnHover className="[--duration:45s] [--gap:1rem]" repeat={3}>
          {deliveries.map((d) => (
            <figure key={d.src} className="relative w-[240px] shrink-0 overflow-hidden rounded-[22px] border border-white/10 sm:w-[300px]">
              <img src={d.src} alt={d.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 font-wide text-[9px] tracking-[0.3em] text-gold">ENTREGA OUROCAR</span>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
