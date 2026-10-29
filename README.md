# Ourocar Veículos | Ubá: site (front-end)

Este é um protótipo do front-end em Vite, React, TypeScript e Tailwind v4. O 3D usa React Three Fiber e drei, as animações usam motion e Lenis, e os componentes vêm do Magic UI (marquee, number-ticker, border-beam e shine-border).

```bash
npm install
npm run dev
npm run build
```

## Estrutura
- `src/sections/`: as seções da página (Hero, Services, Showroom, Numbers, Store, Simulator e Footer).
- `src/components/three/`: `HeroScene` (o superesportivo dourado) e `WheelScene` (a roda procedural).
- `src/data.ts`: WhatsApp, links e fotos. **Os textos e dados da loja ficam aqui.**
- `public/ourocar/`: logo, destaques e fotos originais do Instagram, sem edição.
- `public/images/`: fundos gerados pelo Codex (`$imagegen`), convertidos para WebP. Os PNG originais estão em `design-source/`.
- `material-original/`: cópia intacta do pacote de pesquisa.

## Créditos e licenças
- O modelo 3D do hero (e a roda da seção "Em números", tirada do mesmo arquivo) é o "Ferrari 458 Italia", de vicent091036 (Sketchfab), sob licença **CC BY 4.0**. Ele vem dos exemplos do three.js e hoje é carregado pelo jsDelivr. Para produção, copie `ferrari.glb` e `ferrari_ao.png` para `public/models/` e troque as URLs em `src/components/three/assets.ts`. Mantenha o crédito no site. Se preferir não exibir uma marca de terceiros, troque por outro modelo GLB.
- Os fundos (estrada com rastros de luz, seda dourada e farol) são imagens geradas por IA e não mostram a loja real.

## Pendências antes de publicar
- Endereço completo, horários, CNPJ e e-mail. O rodapé hoje mostra só "Ubá · MG" e um link de busca no Google Maps.
- Confirmar com a loja o "+2.000 carros vendidos", que hoje vem da bio do Instagram.
- Pegar o logo em alta resolução. O atual tem 150 px.
- Pegar as fotos originais e a autorização de uso das imagens de clientes nas entregas.
- O showroom mostra fotos publicadas no Instagram, e elas **não** representam o estoque atual.
