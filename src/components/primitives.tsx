import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export const spring = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint)
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return mobile
}

/** true enquanto o elemento estiver perto da viewport — usado para pausar o WebGL. */
export function useNearViewport<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [margin])
  return [ref, near] as const
}

export function Reveal({ children, delay = 0, y = 40, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...spring, delay, opacity: { duration: 0.6, delay }, filter: { duration: 0.6, delay } }}
    >
      {children}
    </motion.div>
  )
}

/** Título com palavras subindo uma a uma, como num letreiro. */
export function SplitHeading({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className={cn('inline-block', className)} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%', rotate: 4 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: delay + i * 0.06 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Desloca o conteúdo em Y conforme o elemento atravessa a tela. speed > 0 = mais lento que o scroll. */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`])
  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Palavra gigante vazada que corre na horizontal com o scroll. */
export function ScrollWord({ text, className, reverse = false }: { text: string; className?: string; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ['-40%', '5%'] : ['5%', '-40%'])
  return (
    <div ref={ref} aria-hidden className={cn('pointer-events-none absolute inset-x-0 -z-10 overflow-hidden', className)}>
      <motion.p
        style={{ x }}
        className="whitespace-nowrap font-display text-[24vw] font-black uppercase italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(246,216,70,0.12)] md:text-[16vw]"
      >
        {text}
      </motion.p>
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 font-wide text-[10px] uppercase tracking-[0.35em] text-gold/90 sm:text-[11px]', className)}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
      {children}
    </span>
  )
}

export function Magnetic({ children, className, strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)
  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), spring)
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), spring)
  const glowX = useTransform(mx, (v) => `${v * 100}%`)
  const glowY = useTransform(my, (v) => `${v * 100}%`)
  return (
    <motion.div
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background: useTransform([glowX, glowY], ([gx, gy]) => `radial-gradient(420px circle at ${gx} ${gy}, rgba(246,216,70,0.16), transparent 45%)`),
        }}
      />
    </motion.div>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 9.44 9.45c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.3 11.3 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.37-11.37 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
