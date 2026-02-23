# 🚀 Início Rápido - POS Controle Frontend

## Comandos Essenciais

### 1️⃣ Primeira Vez (Configuração Inicial)

```bash
# Entrar no diretório
cd pos-controle-frontend

# Instalar dependências (se ainda não instalou)
npm install

# Arquivo .env já está configurado para API local
# VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 2️⃣ Executar o Projeto

**Terminal 1 - Iniciar a API:**
```bash
cd /home/sidney/automacoes/pos-controle/api-pos-controle
npm run dev
```

**Terminal 2 - Iniciar o Frontend:**
```bash
cd /home/sidney/automacoes/pos-controle/frontend/pos-controle-frontend
npm run dev
```

### 3️⃣ Acessar

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api/v1
- **Swagger da API**: http://localhost:3000/docs

## 📂 Estrutura Resumida

```
src/
├── components/     # Componentes reutilizáveis
├── hooks/          # Hooks customizados
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
└── types/          # Tipos TypeScript
```

## 🎯 Funcionalidades Disponíveis

### Dashboard (/)
- Visualização de estatísticas
- Produtos recentes
- Feiras recentes

### Produtos (/products)
- Listar todos os produtos
- Criar novo produto
- Deletar produto

### Feiras (/fairs)
- Listar todas as feiras
- Criar nova feira
- Sincronizar feira com sistema externo

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Verificar tipos TypeScript
npx tsc --noEmit
```

## ⚡ Dicas

1. **Sempre inicie a API primeiro** antes do frontend
2. A porta do frontend é **5173** (Vite padrão)
3. A porta da API é **3000**
4. Hot reload está ativado - mudanças aparecem automaticamente
5. Erros de TypeScript aparecem no terminal e no browser

## 🐛 Solução de Problemas

### Frontend não conecta na API
```bash
# Verificar se API está rodando
curl http://localhost:3000/api/v1/products

# Verificar arquivo .env
cat .env
# Deve conter: VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Erro de build
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta 5173 já em uso
```bash
# Matar processo na porta 5173
lsof -ti:5173 | xargs kill -9

# Ou usar outra porta
npm run dev -- --port 3001
```

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `README.md` - Documentação técnica
- `PROJETO.md` - Arquitetura e detalhes do projeto

---

**Pronto para começar!** 🎉
