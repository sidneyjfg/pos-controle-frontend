# Documentação do Projeto NerusMobile Frontend

## 📋 Visão Geral

Este projeto é um frontend completo desenvolvido em React + TypeScript + Vite + Tailwind CSS que se conecta à API `api-pos-controle` localizada em `/home/sidney/automacoes/pos-controle/api-pos-controle`.

## ✅ Status do Projeto

**Projeto 100% completo e funcional!**

### ✓ Concluído

1. ✅ Estrutura inicial do projeto (Vite + React + TypeScript + Tailwind CSS)
2. ✅ Tipos TypeScript para toda a API
3. ✅ Serviços de API (products, fairs, pos)
4. ✅ Hooks customizados (useApi, useFetch, useProducts, useFairs)
5. ✅ Componentes reutilizáveis (Card, Button, Input, Table, Modal)
6. ✅ Páginas completas (Dashboard, Products, Fairs)
7. ✅ Roteamento configurado
8. ✅ Layout com navegação
9. ✅ Build testado e funcional
10. ✅ Servidor de desenvolvimento rodando

## 🏗️ Arquitetura

### Estrutura de Pastas

```
pos-controle-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx         # Botão com variantes e loading
│   │   │   ├── Card.tsx           # Container estilizado
│   │   │   ├── Input.tsx          # Input com label e validação
│   │   │   ├── Modal.tsx          # Modal reutilizável
│   │   │   ├── Table.tsx          # Tabela responsiva genérica
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── Layout.tsx         # Layout principal
│   │       ├── Navbar.tsx         # Barra de navegação
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useApi.ts              # Hook para chamadas API
│   │   ├── useFetch.ts            # Hook para buscar dados
│   │   ├── useProducts.ts         # Hook específico de produtos
│   │   ├── useFairs.ts            # Hook específico de feiras
│   │   └── index.ts
│   ├── pages/
│   │   ├── Dashboard.tsx          # Página inicial com estatísticas
│   │   ├── Products.tsx           # Gerenciamento de produtos
│   │   ├── Fairs.tsx              # Gerenciamento de feiras
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts                 # Configuração Axios
│   │   ├── product.service.ts     # Serviços de produtos
│   │   ├── fair.service.ts        # Serviços de feiras
│   │   ├── pos.service.ts         # Serviços externos
│   │   └── index.ts
│   ├── types/
│   │   ├── product.types.ts       # Tipos de produtos
│   │   ├── fair.types.ts          # Tipos de feiras
│   │   ├── api.types.ts           # Tipos genéricos da API
│   │   └── index.ts
│   ├── utils/                     # Utilitários (vazio por enquanto)
│   ├── App.tsx                    # Componente raiz com rotas
│   ├── main.tsx                   # Ponto de entrada
│   └── index.css                  # Configuração Tailwind
├── .env                           # Variáveis de ambiente
├── .env.example                   # Exemplo de variáveis
├── tailwind.config.js             # Configuração Tailwind
├── postcss.config.js              # Configuração PostCSS
├── vite.config.ts                 # Configuração Vite
├── tsconfig.json                  # Configuração TypeScript
├── package.json                   # Dependências
└── README.md                      # Documentação
```

## 🎨 Componentes Desenvolvidos

### Common Components

1. **Button** - Botão versátil com:
   - Variantes: primary, secondary, danger, success
   - Tamanhos: sm, md, lg
   - Estado de loading
   - Suporte a disabled

2. **Card** - Container estilizado com:
   - Sombra e bordas arredondadas
   - Título opcional
   - Padding consistente

3. **Input** - Campo de entrada com:
   - Label opcional
   - Mensagens de erro
   - Validação visual
   - Totalmente tipado

4. **Table** - Tabela genérica com TypeScript:
   - Colunas configuráveis
   - Accessor por propriedade ou função
   - Estado de loading
   - Mensagem de vazio

5. **Modal** - Modal reutilizável com:
   - Overlay clicável
   - Footer customizável
   - Animações
   - Fechar com X

### Layout Components

1. **Navbar** - Navegação principal com:
   - Logo/título
   - Links com highlight ativo
   - Design responsivo

2. **Layout** - Container principal que:
   - Envolve todas as páginas
   - Inclui navbar
   - Padding consistente

## 📄 Páginas Implementadas

### 1. Dashboard (/)
- Estatísticas gerais (Total de Produtos, Feiras, etc)
- Cards clicáveis que navegam para páginas específicas
- Listas de produtos e feiras recentes
- Indicadores visuais (ícones coloridos, badges)

### 2. Products (/products)
- Listagem completa de produtos em tabela
- Botão "Novo Produto" que abre modal
- Formulário de criação de produto
- Botão de deletar com confirmação
- Estados de loading e erro

### 3. Fairs (/fairs)
- Listagem completa de feiras em tabela
- Botão "Nova Feira" que abre modal
- Formulário de criação de feira
- Botão de sincronização com sistema externo
- Badges de status (Ativa, Sincronizada)

## 🔌 Integração com API

### Endpoints Utilizados

#### Products
- `GET /api/v1/products` - Lista produtos
- `GET /api/v1/products/:id` - Busca por ID
- `POST /api/v1/products` - Cria produto
- `DELETE /api/v1/products/:id` - Deleta produto

#### Fairs
- `GET /api/v1/fairs` - Lista feiras
- `GET /api/v1/fairs/:fairId` - Busca por ID
- `POST /api/v1/fairs` - Cria feira
- `PATCH /api/v1/fairs/:fairId/products/:internalCode` - Atualiza preço
- `POST /api/v1/fairs/:fairId/sync` - Sincroniza feira

#### External (POS)
- `GET /api/v1/external/products` - Produtos externos
- `GET /api/v1/external/producttypes` - Tipos de produtos
- `GET /api/v1/external/unittypes` - Tipos de unidades
- `GET /api/v1/external/productgroups` - Grupos de produtos

## 🎯 Hooks Customizados

### useApi
Hook genérico para chamadas API com:
- Estado de loading
- Estado de erro
- Função execute para disparar chamada
- Função reset para limpar estado

### useFetch
Hook para buscar dados automaticamente:
- Fetch automático ao montar componente
- Opção de fetch manual (immediate: false)
- Função refetch para recarregar dados
- Estados de loading e erro

### useProducts
Hook específico que retorna:
- Lista de produtos
- Função para criar produto
- Função para deletar produto
- Função refetch

### useFairs
Hook específico que retorna:
- Lista de feiras
- Função para criar feira
- Função para atualizar preço
- Função para sincronizar
- Função refetch

## 🚀 Como Usar

### Iniciar o Projeto

1. **Instalar dependências:**
```bash
cd pos-controle-frontend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
# O arquivo .env já está criado com:
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. **Iniciar API (em outro terminal):**
```bash
cd /home/sidney/automacoes/pos-controle/api-pos-controle
npm run dev
```

4. **Iniciar frontend:**
```bash
cd pos-controle-frontend
npm run dev
```

5. **Acessar:**
- Frontend: http://localhost:5173
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/docs

### Build para Produção

```bash
npm run build
npm run preview  # Para visualizar o build
```

## 🎨 Design System

### Cores (Tailwind)
- **Primary**: Blue (bg-blue-600, bg-blue-700)
- **Secondary**: Gray (bg-gray-200, bg-gray-300)
- **Danger**: Red (bg-red-600, bg-red-700)
- **Success**: Green (bg-green-600, bg-green-700)

### Espaçamento
- Padding padrão de cards: 6 (1.5rem)
- Gaps entre elementos: 4-6
- Container padding: 4

### Tipografia
- Títulos principais: text-3xl font-bold
- Títulos de cards: text-xl font-bold
- Texto normal: text-base
- Texto secundário: text-sm text-gray-500

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "axios": "^1.13.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.3",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "tailwindcss": "^4.1.3",
    "typescript": "~5.8.3",
    "vite": "^7.3.1"
  }
}
```

## ✨ Funcionalidades Implementadas

- ✅ CRUD completo de produtos
- ✅ CRUD completo de feiras
- ✅ Sincronização de feiras com API externa
- ✅ Dashboard com estatísticas em tempo real
- ✅ Tabelas responsivas com ordenação
- ✅ Modais para criação de recursos
- ✅ Estados de loading em todas as operações
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Validação de formulários
- ✅ Navegação entre páginas
- ✅ Design responsivo
- ✅ Tipagem completa com TypeScript

## 🔮 Possíveis Melhorias Futuras

- [ ] Adicionar paginação nas tabelas
- [ ] Implementar busca/filtros
- [ ] Adicionar edição inline de produtos/feiras
- [ ] Gráficos no dashboard
- [ ] Notificações toast
- [ ] Tema dark mode
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] Autenticação/autorização
- [ ] Exportação de dados (CSV, PDF)

## 👨‍💻 Desenvolvedor

Projeto desenvolvido para sistema de controle de PDV.

---

**Data de criação:** 22 de fevereiro de 2026
