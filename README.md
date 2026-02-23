# POS Controle - Frontend

Frontend desenvolvido em React + TypeScript + Vite + Tailwind CSS para o sistema de controle de PDV.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis (Button, Card, Table, etc)
│   └── layout/          # Componentes de layout (Navbar, Layout)
├── hooks/               # Hooks customizados (useApi, useFetch, useProducts, etc)
├── pages/               # Páginas da aplicação (Dashboard, Products, Fairs)
├── services/            # Serviços de API (product, fair, pos)
├── types/               # Definições TypeScript
└── utils/               # Utilitários
```

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar a URL da API no arquivo .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 🏃 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📡 Conexão com a API

O frontend se conecta com a API em `http://localhost:3000/api/v1` por padrão.

Certifique-se de que a API está rodando antes de iniciar o frontend:

```bash
cd /home/sidney/automacoes/pos-controle/api-pos-controle
npm run dev
```

## 📄 Páginas

- **Dashboard** (`/`) - Visão geral com estatísticas
- **Produtos** (`/products`) - Gerenciamento de produtos
- **Feiras** (`/fairs`) - Gerenciamento de feiras

## 🎨 Componentes Principais

### Common Components
- `Card` - Container com sombra e padding
- `Button` - Botão com variantes (primary, secondary, danger, success)
- `Input` - Campo de entrada com label e validação
- `Table` - Tabela responsiva com loading e empty state
- `Modal` - Modal reutilizável

### Hooks
- `useApi` - Hook para chamadas API com loading/error
- `useFetch` - Hook para buscar dados com auto-fetch
- `useProducts` - Hook específico para produtos
- `useFairs` - Hook específico para feiras

## 🔌 Serviços da API

### Product Service
- `getAll()` - Lista todos os produtos
- `getById(id)` - Busca produto por ID
- `create(data)` - Cria novo produto
- `update(id, data)` - Atualiza produto
- `delete(id)` - Remove produto

### Fair Service
- `getAll()` - Lista todas as feiras
- `getById(fairId)` - Busca feira por ID
- `create(data)` - Cria nova feira
- `updateProductPrice(fairId, internalCode, data)` - Atualiza preço de produto na feira
- `sync(fairId)` - Sincroniza feira com sistema externo

### POS Service
- `getExternalProducts()` - Busca produtos do sistema externo
- `getProductTypes()` - Lista tipos de produtos
- `getUnitTypes()` - Lista tipos de unidades
- `getProductGroups()` - Lista grupos de produtos

## 📝 Licença

ISC
