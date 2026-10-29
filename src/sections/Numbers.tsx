import { lazy, Suspense, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Eyebrow, Parallax, Reveal, ScrollWord, SplitHeading, useIsMobile, useNearViewport } from '@/components/primitives'

const WheelScene = lazy(() => import('@/components/three/WheelScene'))

export default function Numbers() {
  const mobile = useIsMobile()
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [canvasRef, near] = useNearViewport<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progress.current = v
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={section} className="relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-36">
      <ScrollWord text="+2.000 vendidos · Ubá ·" reverse className="top-1/2 -translate-y-1/2" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <Parallax speed={0.12} className="relative order-2 lg:order-1">
          <div ref={canvasRef} className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-gold/20 blur-[90px]" />
            <div aria-hidden className="absolute inset-[4%] rounded-full border border-gold/15" />
            <div aria-hidden className="absolute inset-[-2%] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-white/10" />
            <Suspense fallback={null}>
              <WheelScene progress={progress} active={near} mobile={mobile} />
            </Suspense>
          </div>
        </Parallax>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Em números</Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase italic leading-[0.9]">
            <SplitHeading text="Rodando forte" />
            <br />
            <SplitHeading text="em Ubá." className="text-gold-gradient" delay={0.15} />
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10">
            <div className="col-span-2 bg-ink p-6 sm:p-8">
              <p className="font-display text-[clamp(3.6rem,10vw,7rem)] font-black italic leading-none">
                <span className="text-gold">+</span>
                <NumberTicker value={2000} className="text-cream" />
              </p>
              <p className="mt-2 text-[14px] text-cream/60">carros vendidos, segundo a própria loja.</p>
            </div>
            <div className="bg-ink p-6 sm:p-8">
              <p className="font-display text-5xl font-black italic leading-none text-cream sm:text-6xl">
                <NumberTicker value={4} className="text-cream" />
              </p>
              <p className="mt-2 text-[13px] text-cream/60">formas de negociar: compra, venda, troca e financiamento.</p>
            </div>
            <div className="bg-ink p-6 sm:p-8">
              <p className="font-display text-5xl font-black italic leading-none text-gold sm:text-6xl">1:1</p>
              <p className="mt-2 text-[13px] text-cream/60">atendimento direto pelo WhatsApp com a equipe da loja.</p>
            </div>
          </div>

          <Reveal delay={0.1} className="mt-6">
            <div className="relative h-44 overflow-hidden rounded-[26px] border border-white/10 sm:h-56">
              <motion.img src="/images/detail-headlight.webp" alt="" loading="lazy" style={{ y: imgY }} className="absolute inset-0 h-[130%] w-full object-cover object-[50%_45%]" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
              <p className="relative flex h-full max-w-[16rem] items-center p-6 font-display text-2xl font-extrabold uppercase italic leading-tight sm:max-w-xs sm:text-3xl">
                Cada carro preparado para brilhar na sua garagem.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
