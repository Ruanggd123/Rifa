# MegaRifas - Landing Page de Alta Conversão (Mobile-First)

Este é um projeto moderno de Landing Page de Rifas ("Ações entre Amigos"), otimizado 100% para dispositivos móveis (mais de 90% do tráfego deste setor) com fluxo interativo de compra, simulação de checkout express de 1 passo, prêmios instantâneos colapsáveis e suporte nativo a **Light Mode / Dark Mode**.

## 🎨 Funcionalidades
- **Tema Híbrido:** Alternador de modo claro (Light) e escuro (Dark) com persistência automática no `localStorage`.
- **Interface Mobile-First:** Perfeita ergonomia para polegares no celular, botões amplos e navegação ultra-veloz.
- **Motor de Compra Inteligente:** Seleção de combos, botões de incrementos rápidos e cálculo reativo de preços diretamente no CTA.
- **Acordeões Interativos:** Prêmios instantâneos organizados com controle inteligente de altura para manter a página compacta.
- **Checkout de 1 Passo:** Captura simplificada de Nome/Telefone com geração instantânea de PIX Copia e Cola com temporizador regressivo de 10 minutos.
- **Prova Social:** Listagem zebrada e destacada com os últimos bilhetes e participantes premiados.

## 📂 Estrutura de Arquivos
- `index.html`: Estrutura semântica e acessível (SEO otimizado).
- `style.css`: Folha de estilo utilizando Vanilla CSS puro com design premium de dark/light mode.
- `app.js`: Script de interatividade, modais e simulações reativas de checkout.
- `titan_160_banner.png`: Mockup de alta qualidade para o banner principal.

---

## 🛠️ Como Funciona a Integração Real do PIX?

Para sistemas de produção reais, a aprovação do PIX não é simulada. O fluxo de backend funciona da seguinte maneira:

### 1. Integração com Gateway de Pagamento (API PIX)
A plataforma é conectada a uma API de pagamentos (como *Mercado Pago, EFI (Gerencianet), Asaas, OpenPix ou Stripe*).
- Quando o usuário clica em **"Ir para o Pagamento"**, o servidor faz uma requisição HTTP POST para o endpoint do gateway (Ex: `/v2/cob` da API Pix do Banco Central).
- O gateway responde contendo a string de chave PIX Copia e Cola (Payload Pix) e a imagem em Base64 do QR Code dinâmico, além de um ID único de transação (TXID).

### 2. Webhooks para Notificação em Tempo Real (Verificação Instantânea)
- O backend da rifa expõe uma rota pública segura (Ex: `https://seusite.com/api/webhooks/pix`).
- O gateway de pagamentos é configurado para enviar uma requisição POST para esse webhook no exato milissegundo em que o banco do cliente concluir a transferência.
- O payload do webhook contém o status `approved`, o ID do PIX e o valor.
- Ao receber o webhook, o backend altera o status do pedido no banco de dados de `pendente` para `pago`, reserva permanentemente os bilhetes e associa o nome/telefone do usuário a eles.

### 3. Comunicação em Tempo Real com o Frontend
Para que o usuário veja a confirmação de pagamento sem precisar recarregar a página, são usadas duas abordagens principais:
- **WebSockets (Socket.io / Pusher):** O frontend abre um canal de WebSocket com o backend associado ao ID do pagamento. Assim que o webhook do banco aprova, o servidor emite uma mensagem pelo WebSocket e a página muda de forma instantânea para a tela de "Pagamento Confirmado! Seus números são...".
- **Polling Curto (Short Polling):** O javascript executa uma chamada `fetch` periódica a cada 3 a 5 segundos (Ex: `GET /api/payment/status/:id`) para perguntar se o pagamento foi atualizado no banco. É a alternativa mais simples quando não se utiliza WebSockets.

---

## 🚀 Como Hospedar no GitHub Pages

Para publicar seu projeto gratuitamente no GitHub Pages, siga os passos abaixo:

### Passo 1: Inicializar o Repositório Local
No terminal (dentro da pasta do projeto):
```bash
git init
git add .
git commit -m "feat: Mobile-first Raffle Landing Page with Light/Dark Mode & Checkout Simulator"
```

### Passo 2: Vincular ao Repositório do GitHub
Substitua com o link do seu repositório criado no GitHub:
```bash
git branch -M main
git remote add origin https://github.com/Ruanggd123/Rifa.git
git push -u origin main
```

### Passo 3: Ativar o GitHub Pages no Painel
1. Vá até o seu repositório no site do GitHub.
2. Clique na aba **Settings** (Configurações) no menu superior.
3. No menu lateral esquerdo, clique em **Pages** (sob a seção "Code and automation").
4. Sob **Build and deployment**, selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**.
6. Aguarde 1 a 2 minutos e o GitHub fornecerá um link público (Ex: `https://Ruanggd123.github.io/Rifa/`).
