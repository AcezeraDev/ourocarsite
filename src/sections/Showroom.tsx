import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { INSTAGRAM_URL, showroom, whatsappLink } from '@/data'
import { Eyebrow, InstagramIcon, WhatsAppIcon, spring, useIsMobile } from '@/components/primitives'

const N = showroom.length
const label = (i: number) => String(i + 1).padStart(2, '0')

/*
  Carrossel 3D guiado pelo scroll: os cards ficam numa curva (como um
  cilindro visto por dentro). O scroll gira a curva; o card ativo vem
  para a frente, cresce e acende.
*/
function Card({ i, active, mobile }: { i: number; active: MotionValue<number>; mobile: boolean }) {
  const item = showroom[i]
  const step = mobile ? 78 : 46 // % da largura do card entre vizinhos
  const offset = useTransform(active, (a) => i - a)
  const x = useTransform(offset, (o) => `${o * step}vw`)
  const rotateY = useTransform(offset, (o) => o * (mobile ? -18 : -32))
  const z = useTransform(offset, (o) => -Math.abs(o) * (mobile ? 260 : 420))
  const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 2) * 0.08)
  const opacity = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 2.5) * 0.32)
  const brightness = useTransform(offset, (o) => `brightness(${1 - Math.min(Math.abs(o), 1.5) * 0.45})`)
  const innerX = useTransform(offset, (o) => `${o * -14}%`)
  const zIndex = useTransform(offset, (o) => 100 - Math.round(Math.abs(o) * 10))

  return (
    <motion.figure
      style={{ x, rotateY, z, scale, opacity, filter: brightness, zIndex }}
      className="absolute left-1/2 top-1/2 aspect-[4/5] w-[74vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/10 bg-smoke shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:w-[48vw] md:aspect-[16/11] md:w-[44vw] lg:w-[40vw]"
    >
      <motion.img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        style={{ x: innerX }}
        className="absolute inset-y-0 -left-[15%] h-full w-[130%] max-w-none object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
      <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 font-wide text-[9px] tracking-[0.25em] text-cream/85">
        Nº {label(i)} · {item.date}
      </span>
      <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
        <p className="max-w-[55%] text-[12px] leading-snug text-cream/70">Publicado no Instagram da loja</p>
        <a
          href={whatsappLink(`Olá, Ourocar! Vi no site o veículo da foto Nº ${label(i)} (${item.date}). Ele ainda está disponível?`)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-[12px] font-bold text-black transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-105"
        >
          <WhatsAppIcon className="size-4" /> Consultar
        </a>
      </figcaption>
    </motion.figure>
  )
}

export default function Showroom() {
  const mobile = useIsMobile()
  const target = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const active = useTransform(smooth, [0.05, 0.95], [0, N - 1], { clamp: true })
  const [current, setCurrent] = useState(0)
  useMotionValueEvent(active, 'change', (v) => setCurrent(Math.round(v)))

  const bigX = useTransform(smooth, [0, 1], ['10%', '-60%'])
  const bar = useTransform(smooth, [0.05, 0.95], ['0%', '100%'])
  const ringRotate = useTransform(smooth, [0, 1], [0, 220])

  return (
    <section ref={target} id="showroom" className="relative" style={{ height: `${N * 75 + 60}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* palavra gigante vazada em parallax */}
        <motion.p
          aria-hidden
          style={{ x: bigX }}
          className="pointer-events-none absolute top-[14%] whitespace-nowrap font-display text-[30vw] font-black uppercase italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(246,216,70,0.14)] md:top-[8%] md:text-[22vw]"
        >
          Showroom · Ourocar ·
        </motion.p>
        <motion.div
          aria-hidden
          style={{ rotate: ringRotate }}
          className="pointer-events-none absolute left-1/2 top-1/2 size-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/10 md:size-[70vw]"
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl items-start justify-between gap-6 px-5 pt-24 sm:px-8 md:pt-28">
          <div>
            <Eyebrow>Showroom</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-extrabold uppercase italic leading-[0.9]">
              Direto do <span className="text-gold-gradient">nosso salão.</span>
            </h2>
          </div>
          <div className="hidden max-w-xs text-right md:block">
            <p className="text-[14px] text-cream/55">
              Veículos publicados no Instagram da loja. O estoque gira rápido: toque em <span className="text-gold">Consultar</span> e confirme a disponibilidade.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-cream hover:text-gold">
              <InstagramIcon className="size-4" /> Ver tudo no Instagram <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="absolute inset-0 top-[10%] [perspective:1400px] [transform-style:preserve-3d]">
          {showroom.map((_, i) => (
            <Card key={i} i={i} active={active} mobile={mobile} />
          ))}
        </div>

        {/* contador + barra */}
        <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 sm:bottom-8 sm:px-8">
          <div className="flex items-end gap-3 font-display font-black italic leading-none">
            <span className="relative block h-[3.2rem] w-[4.2rem] overflow-hidden text-[3.2rem] text-gold sm:h-[4.5rem] sm:w-[6rem] sm:text-[4.5rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={spring}
                  className="absolute inset-0"
                >
                  {label(current)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="pb-1 text-xl text-cream/30 sm:text-2xl">/ {label(N - 1)}</span>
          </div>
          <div className="mb-3 h-px flex-1 bg-white/10">
            <motion.div style={{ width: bar }} className="h-px bg-gradient-to-r from-amber to-gold shadow-[0_0_12px_rgba(246,216,70,0.8)]" />
          </div>
          <p className="mb-1 hidden font-wide text-[9px] tracking-[0.35em] text-cream/40 sm:block">ROLE PARA GIRAR</p>
        </div>
      </div>
    </section>
  )
}
