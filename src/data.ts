// Dados observados no perfil público @ourocarveiculos.oficial (coleta 28/10/2026).
// Itens marcados como pendentes precisam de confirmação da loja antes de publicar.

export const WHATSAPP_NUMBER = '5532998350552'
export const WHATSAPP_DISPLAY = '(32) 99835-0552'
export const INSTAGRAM_URL = 'https://www.instagram.com/ourocarveiculos.oficial/'
export const INSTAGRAM_HANDLE = '@ourocarveiculos.oficial'
export const MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=Ourocar+Veiculos+Uba+MG'

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const services = [
  {
    id: 'compra',
    title: 'Compra',
    kicker: '01',
    text: 'Encontre o seu próximo carro no nosso showroom. Fale com a equipe e veja as opções disponíveis hoje.',
    cover: '/ourocar/destaques/compra.jpg',
    message: 'Olá, Ourocar! Quero comprar um carro. Quais opções vocês têm disponíveis?',
  },
  {
    id: 'venda',
    title: 'Venda',
    kicker: '02',
    text: 'Quer vender o seu veículo? Envie as informações pelo WhatsApp e receba o retorno da nossa equipe.',
    cover: '/ourocar/destaques/vendidos.jpg',
    message: 'Olá, Ourocar! Quero vender o meu carro. Posso enviar as informações?',
  },
  {
    id: 'troca',
    title: 'Troca',
    kicker: '03',
    text: 'Use o seu carro atual na negociação. Mande os dados e peça uma avaliação para a troca.',
    cover: '/ourocar/destaques/trocas.jpg',
    message: 'Olá, Ourocar! Quero trocar o meu carro. Como funciona a avaliação?',
  },
  {
    id: 'financiamento',
    title: 'Financiamento',
    kicker: '04',
    text: 'Precisa financiar? Peça uma simulação e entenda as condições direto com o atendimento.',
    cover: '/ourocar/destaques/financiamento.jpg',
    message: 'Olá, Ourocar! Gostaria de simular um financiamento.',
  },
] as const

// Fotos publicadas no Instagram. NÃO representam estoque atual.
export const showroom = [
  { src: '/ourocar/fotos/01-foto-publicacao.jpg', w: 640, h: 480, date: 'set/2026', alt: 'SUV prata exposto no showroom da Ourocar, com o logo na parede ao fundo' },
  { src: '/ourocar/fotos/02-foto-publicacao.jpg', w: 640, h: 480, date: 'set/2026', alt: 'SUV prata no showroom da Ourocar com quadros de carros esportivos ao fundo' },
  { src: '/ourocar/fotos/03-foto-publicacao.jpg', w: 640, h: 480, date: 'set/2026', alt: 'Picape escura no showroom da Ourocar' },
  { src: '/ourocar/fotos/05-foto-publicacao.jpg', w: 640, h: 480, date: 'out/2026', alt: 'SUV branco com placa Ourocar em uma rua arborizada' },
  { src: '/ourocar/fotos/04-capa-reel.jpg', w: 360, h: 640, date: 'out/2026', alt: 'SUV branco em estrada com palmeiras, capa de vídeo da Ourocar' },
] as const

export const deliveries = [
  { src: '/ourocar/fotos/12-foto-publicacao.jpg', alt: 'Entrega de moto vermelha a uma cliente em frente ao painel Ourocar' },
  { src: '/ourocar/fotos/11-foto-publicacao.jpg', alt: 'Entrega de chave de picape vermelha a um cliente no showroom' },
  { src: '/ourocar/fotos/08-capa-reel.jpg', alt: 'SUV branco com laço vermelho pronto para entrega' },
  { src: '/ourocar/fotos/10-capa-reel.jpg', alt: 'Entrega de SUV branco com laço vermelho no showroom' },
] as const

export const highlights = [
  { label: 'Vendidos', cover: '/ourocar/destaques/vendidos.jpg', href: 'https://www.instagram.com/stories/highlights/18020194904905896/' },
  { label: 'Documentação', cover: '/ourocar/destaques/documentacao.jpg', href: 'https://www.instagram.com/stories/highlights/18073582157705763/' },
  { label: 'Trocas', cover: '/ourocar/destaques/trocas.jpg', href: 'https://www.instagram.com/stories/highlights/18114306553930258/' },
  { label: 'Financiamento', cover: '/ourocar/destaques/financiamento.jpg', href: 'https://www.instagram.com/stories/highlights/18176999842418712/' },
  { label: 'Localização', cover: '/ourocar/destaques/localizacao.jpg', href: 'https://www.instagram.com/stories/highlights/18088078853423105/' },
  { label: 'Compra', cover: '/ourocar/destaques/compra.jpg', href: 'https://www.instagram.com/stories/highlights/18221126287327466/' },
  { label: 'Sobre nós', cover: '/ourocar/destaques/sobre-nos.jpg', href: 'https://www.instagram.com/stories/highlights/18105940373035329/' },
] as const

export const storefront = [
  { src: '/ourocar/fotos/07-capa-reel.jpg', alt: 'Fachada da Ourocar Veículos com o letreiro e um hatch prata à frente' },
  { src: '/ourocar/fotos/06-capa-reel.jpg', alt: 'Fachada da Ourocar Veículos com um SUV branco à frente' },
] as const
