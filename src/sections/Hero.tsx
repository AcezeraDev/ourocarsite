import { lazy, Suspense, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, MapPin } from 'lucide-react'
import { whatsappLink, WHATSAPP_DISPLAY } from '@/data'
import { Magnetic, WhatsAppIcon, spring, useIsMobile, useNearViewport } from '@/components/primitives'

const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const TITLE = ['Seu próximo', 'carro está', 'aqui.']

export default function Hero() {
  const mobile = useIsMobile()
  const reduce = useReducedMotion()
  const [sceneRef, near] = useNearViewport<HTMLDivElement>('0px')
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <section ref={section} id="inicio" className="relative isolate flex flex-col overflow-hidden md:block md:h-[100svh] md:min-h-[640px]">
      {/* camada 1: fotografia gerada (estrada com rastros de luz) */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: reduce ? 0 : bgY }}>
        <img
          src="/images/bg-light-trails.webp"
          alt=""
          className="size-full scale-110 object-cover object-[70%_center] opacity-70"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
      </motion.div>

      {/* camada 2: cena WebGL — no celular vira um "palco" abaixo dos botões,
          para o carro nunca ficar por cima do texto */}
      <div ref={sceneRef} className="relative order-last h-[46svh] min-h-[300px] md:absolute md:inset-0 md:-z-10 md:h-auto">
        <Suspense fallback={null}>
          <HeroScene mobile={mobile} active={near} />
        </Suspense>
      </div>

      {/* camada 3: conteúdo */}
      <motion.div
        style={{ opacity: mobile ? 1 : fade, y: reduce || mobile ? 0 : textY }}
        className="mx-auto flex max-w-7xl flex-col justify-start px-5 pt-28 sm:px-8 md:h-full md:justify-center md:pt-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 font-wide text-[9px] uppercase tracking-[0.3em] text-cream/80 sm:text-[10px]"
        >
          <MapPin className="size-3.5 text-gold" /> Ubá · Minas Gerais
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,11vw,8.5rem)] font-black uppercase italic leading-[0.86] tracking-tight">
          {TITLE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={i === 2 ? 'text-gold-gradient inline-block pr-3' : 'inline-block'}
                initial={reduce ? false : { y: '105%', skewY: 6 }}
                animate={{ y: 0, skewY: 0 }}
                transition={{ ...spring, delay: 0.7 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 1.2 }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/70 sm:text-lg"
        >
          Compra, venda, troca e financiamento de veículos com atendimento direto e pessoal. A Ourocar já soma{' '}
          <strong className="font-semibold text-gold">mais de 2.000 carros vendidos</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 1.35 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <a
              href={whatsappLink('Olá, Ourocar! Vim pelo site e quero encontrar o meu próximo carro.')}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-7 py-4 text-[15px] font-bold text-black shadow-[0_10px_50px_-10px_rgba(246,216,70,0.8)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <WhatsAppIcon className="size-5" />
              Falar com a Ourocar
            </a>
          </Magnetic>
          <a href="#showroom" className="glass inline-flex items-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-cream transition-colors hover:text-gold">
            Ver o showroom
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-5 hidden font-wide text-[10px] tracking-[0.25em] text-cream/45 sm:block"
        >
          WHATSAPP {WHATSAPP_DISPLAY}
        </motion.p>
      </motion.div>

      <motion.a
        href="#servicos"
        aria-label="Rolar para os serviços"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-wide text-[9px] tracking-[0.4em] text-cream/50 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        ROLE
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="size-4 text-gold" />
        </motion.span>
      </motion.a>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t md:h-40 from-ink to-transparent" />
    </section>
  )
}
