import { useState, type FormEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'
import { whatsappLink } from '@/data'
import { Eyebrow, Parallax, Reveal, SplitHeading, spring } from '@/components/primitives'
import { cn } from '@/lib/utils'

type Mode = 'troca' | 'financiamento' | 'venda'

const modes: { id: Mode; label: string }[] = [
  { id: 'troca', label: 'Troca' },
  { id: 'financiamento', label: 'Financiamento' },
  { id: 'venda', label: 'Vender meu carro' },
]

function Field({ label, name, placeholder, inputMode, required }: { label: string; name: string; placeholder?: string; inputMode?: 'numeric' | 'text'; required?: boolean }) {
  return (
    <label className="group block">
      <span className="font-wide text-[9px] uppercase tracking-[0.25em] text-cream/50 transition-colors group-focus-within:text-gold">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        inputMode={inputMode}
        required={required}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-[15px] text-cream outline-none transition-all placeholder:text-cream/25 focus:border-gold/70 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(246,216,70,0.12)]"
      />
    </label>
  )
}

export default function Simulator() {
  const [mode, setMode] = useState<Mode>('troca')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const lines = [`Olá, Ourocar! Me chamo ${d.nome}.`]
    if (mode === 'troca') {
      lines.push(`Quero dar meu carro na troca: ${d.meuCarro}${d.ano ? `, ${d.ano}` : ''}${d.km ? `, ${d.km} km` : ''}.`)
      if (d.interesse) lines.push(`Tenho interesse em: ${d.interesse}.`)
      lines.push('Podem avaliar?')
    } else if (mode === 'financiamento') {
      lines.push('Gostaria de simular um financiamento.')
      if (d.interesse) lines.push(`Carro de interesse: ${d.interesse}.`)
      if (d.entrada) lines.push(`Entrada disponível: R$ ${d.entrada}.`)
    } else {
      lines.push(`Quero vender meu carro: ${d.meuCarro}${d.ano ? `, ${d.ano}` : ''}${d.km ? `, ${d.km} km` : ''}.`)
      lines.push('Posso enviar fotos?')
    }
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <section id="simular" className="relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-36">
      <div className="absolute inset-0 -z-10">
        <Parallax speed={0.18} className="absolute -inset-y-[20%] inset-x-0">
          <img src="/images/bg-gold-silk.webp" alt="" loading="lazy" className="size-full object-cover object-right opacity-80" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>Troca & financiamento</Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase italic leading-[0.9]">
            <SplitHeading text="Seu carro vale" />
            <br />
            <SplitHeading text="na negociação." className="text-gold-gradient" delay={0.15} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-cream/65">
              Preencha em 20 segundos. A mensagem já sai pronta no seu WhatsApp, direto para a equipe da Ourocar — nada fica salvo neste site.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="glass relative overflow-hidden rounded-[30px] p-5 sm:p-8">
            <ShineBorder shineColor={['#f6d846', '#f5a300', '#fff3b8']} borderWidth={1.5} duration={12} />
            <LayoutGroup id="sim-tabs">
              <div role="tablist" className="flex gap-1 rounded-full border border-white/10 bg-black/40 p-1">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    role="tab"
                    type="button"
                    aria-selected={mode === m.id}
                    onClick={() => setMode(m.id)}
                    className={cn('relative flex-1 rounded-full px-2 py-2.5 text-[12px] font-bold transition-colors sm:text-[13px]', mode === m.id ? 'text-black' : 'text-cream/60 hover:text-cream')}
                  >
                    {mode === m.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-gold" transition={spring} />}
                    <span className="relative">{m.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Seu nome" name="nome" placeholder="Como podemos te chamar?" required />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={spring}
                  className="space-y-4"
                >
                  {mode !== 'financiamento' && (
                    <>
                      <Field label="Seu carro (marca e modelo)" name="meuCarro" placeholder="Ex.: Fiat Argo Drive" required />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Ano" name="ano" placeholder="2020" inputMode="numeric" />
                        <Field label="Quilometragem" name="km" placeholder="45.000" inputMode="numeric" />
                      </div>
                    </>
                  )}
                  {mode !== 'venda' && <Field label="Carro de interesse" name="interesse" placeholder="Modelo que você procura" />}
                  {mode === 'financiamento' && <Field label="Valor de entrada (opcional)" name="entrada" placeholder="10.000" inputMode="numeric" />}
                </motion.div>
              </AnimatePresence>
              <button
                type="submit"
                className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gold py-4 text-[15px] font-bold text-black shadow-[0_10px_40px_-10px_rgba(246,216,70,0.8)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-[1.02]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Send className="size-4" /> Enviar pelo WhatsApp
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
