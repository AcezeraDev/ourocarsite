import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import Services, { GoldTicker } from '@/sections/Services'
import Showroom from '@/sections/Showroom'
import Numbers from '@/sections/Numbers'
import Store from '@/sections/Store'
import Simulator from '@/sections/Simulator'
import Footer from '@/sections/Footer'
import { WhatsAppIcon, spring } from '@/components/primitives'
import { whatsappLink } from '@/data'

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="text-center">
        <motion.img
          src="/ourocar/logo.jpg"
          alt=""
          width={150}
          height={150}
          className="mx-auto size-32 rounded-full sm:size-36"
          initial={{ scale: 0.6, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={spring}
        />
        <div className="mx-auto mt-6 h-px w-48 overflow-hidden bg-white/10">
          <motion.div className="h-full bg-gold" initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
    </motion.div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-amber via-gold to-amber" />
}

function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink('Olá, Ourocar! Vim pelo site e gostaria de atendimento.')}
          target="_blank"
          rel="noreferrer"
          aria-label="Chamar a Ourocar no WhatsApp"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-gold text-black shadow-[0_10px_40px_-6px_rgba(246,216,70,0.8)] sm:bottom-8 sm:right-8 sm:size-16"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.4s]" />
          <WhatsAppIcon className="relative size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [intro, setIntro] = useState(true)
  const endIntro = useCallback(() => setIntro(false), [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -20 } })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <AnimatePresence>{intro && <Intro onDone={endIntro} />}</AnimatePresence>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <GoldTicker />
        <Services />
        <Showroom />
        <Numbers />
        <Store />
        <Simulator />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <div className="grain" aria-hidden />
    </>
  )
}
