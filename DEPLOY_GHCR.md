# Deploy via GHCR

Este projeto publica a imagem em:

- `ghcr.io/sidneyjfg/pos-controle-frontend-develop:latest`
- `ghcr.io/sidneyjfg/pos-controle-frontend-prod:latest`

Tambem publica uma tag imutavel por commit:

- `ghcr.io/sidneyjfg/pos-controle-frontend-develop:<sha>`
- `ghcr.io/sidneyjfg/pos-controle-frontend-prod:<sha>`

## Antes do primeiro push

No GitHub do repositorio:

1. Acesse `Settings > Actions > General`.
2. Em `Workflow permissions`, marque `Read and write permissions`.
3. Salve.

Configure as variaveis do repositorio em `Settings > Secrets and variables > Actions > Variables`:

```text
VITE_API_BASE_URL_DEVELOP=https://api-homolog.seu-dominio.com/api/v1
VITE_API_BASE_URL_PROD=https://api.seu-dominio.com/api/v1
```

Essas URLs sao embutidas no build do frontend.

## Branches

- Push na branch `develop` publica `ghcr.io/sidneyjfg/pos-controle-frontend-develop:latest`.
- Push na branch `main` ou `master` publica `ghcr.io/sidneyjfg/pos-controle-frontend-prod:latest`.

## Servidor

Instale Docker e Docker Compose Plugin.

Crie um token no GitHub:

1. `GitHub > Settings > Developer settings > Personal access tokens`.
2. Gere um token com `read:packages`.
3. Se o pacote/repositorio for privado, inclua tambem permissao de leitura do repositorio.

Faca login no GHCR no servidor:

```bash
echo "SEU_TOKEN_GITHUB" | docker login ghcr.io -u sidneyjfg --password-stdin
```

Garanta que a rede compartilhada existe:

```bash
docker network create pos-controle
```

## Subir producao

```bash
IMAGE_SUFFIX=prod FRONTEND_PORT=80 docker compose -f docker-compose.frontend.yml pull
IMAGE_SUFFIX=prod FRONTEND_PORT=80 docker compose -f docker-compose.frontend.yml up -d
```

## Subir homologacao/develop

```bash
IMAGE_SUFFIX=develop FRONTEND_PORT=8080 docker compose -f docker-compose.frontend.yml pull
IMAGE_SUFFIX=develop FRONTEND_PORT=8080 docker compose -f docker-compose.frontend.yml up -d
```

## Ver logs

```bash
docker logs -f pos-controle-frontend
```
