# Finance Control API

Sistema de Controle Financeiro Pessoal - API REST construída com Node.js + TypeScript seguindo DDD + Clean Architecture.

## Arquitetura

O projeto segue os princípios de Domain-Driven Design (DDD) e Clean Architecture, organizado em 4 camadas:

```
src/
├── domain/           # Camada de Domínio (Entidades, Value Objects, Erros)
│   ├── entities/     # Agregados: User, Account, Category, Transaction, Budget, Transfer
│   ├── value-objects/# Money, UniqueId
│   └── errors/       # Exceções de domínio
├── application/      # Camada de Aplicação (Use Cases, Ports)
│   ├── use-cases/    # Casos de uso organizados por feature
│   └── ports/        # Interfaces de repositórios e serviços
├── infra/            # Camada de Infraestrutura
│   ├── prisma/       # Cliente Prisma
│   ├── repositories/ # Implementações dos repositórios
│   ├── auth/         # Serviços de autenticação (JWT, Hash)
│   └── http/         # Servidor Express e Swagger
├── interfaces/       # Camada de Interface
│   └── http/         # Controllers, Routes, Middlewares, Validators
└── shared/           # Utilitários compartilhados
    ├── config/       # Configurações
    └── logger/       # Logger (Pino)
```

### Princípios Aplicados

- **Domain não depende de nada externo**: Entidades e Value Objects são puros
- **Application depende apenas de Domain e Ports**: Use Cases orquestram a lógica
- **Infrastructure implementa os Ports**: Prisma Repositories, JWT Service, etc.
- **Controllers não contêm regra de negócio**: Apenas orquestram input/output

## Tecnologias

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript (strict mode)
- **Framework HTTP**: Express
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: Zod
- **Documentação**: Swagger/OpenAPI
- **Testes**: Vitest
- **Logger**: Pino
- **Qualidade**: ESLint, Prettier, Husky, commitlint

## Setup Local

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm

### Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd finance-control-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o PostgreSQL via Docker:
```bash
docker-compose up -d postgres
```

5. Execute as migrations:
```bash
npx prisma migrate dev
```

6. Inicie o servidor:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Inicia o servidor compilado |
| `npm run lint` | Executa o ESLint |
| `npm run lint:fix` | Corrige problemas do ESLint |
| `npm run format` | Formata o código com Prettier |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm test` | Executa os testes |
| `npm run test:coverage` | Executa testes com cobertura |

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Login |
| GET | `/me` | Perfil do usuário autenticado |

### Contas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/accounts` | Listar contas |
| POST | `/accounts` | Criar conta |
| PUT | `/accounts/:id` | Atualizar conta |
| DELETE | `/accounts/:id` | Deletar conta |

### Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories` | Listar categorias |
| POST | `/categories` | Criar categoria |
| PUT | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Deletar categoria |

### Transações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/transactions` | Listar transações (com filtros) |
| POST | `/transactions` | Criar transação |
| PUT | `/transactions/:id` | Atualizar transação |
| DELETE | `/transactions/:id` | Deletar transação |

**Query Parameters para filtros:**
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `accountId`: ID da conta
- `categoryId`: ID da categoria
- `type`: INCOME ou EXPENSE

### Transferências

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/transfers` | Criar transferência entre contas |

### Orçamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/budgets` | Listar orçamentos com status |
| POST | `/budgets` | Criar orçamento |
| PUT | `/budgets/:id` | Atualizar orçamento |
| DELETE | `/budgets/:id` | Deletar orçamento |

### Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/summary/monthly?year=YYYY&month=MM` | Resumo mensal |

## Documentação Swagger

Acesse `http://localhost:3000/docs` para visualizar a documentação interativa da API.

## Decisões de Modelagem

### Value Objects

- **Money**: Encapsula valores monetários com validações (positivo, estritamente positivo) e operações aritméticas. Garante precisão e consistência em cálculos financeiros.
- **UniqueId**: Encapsula UUIDs com validação, garantindo IDs válidos em todo o sistema.

### Agregados

- **User**: Raiz de agregado para autenticação. Contém email, senha (hash) e nome.
- **Account**: Representa contas financeiras (CASH, BANK, CREDIT). Mantém saldo inicial e atual.
- **Category**: Categorias de transações (INCOME, EXPENSE).
- **Transaction**: Lançamentos financeiros vinculados a conta e categoria.
- **Budget**: Orçamentos mensais por categoria com cálculo de status.
- **Transfer**: Transferências entre contas.

### Transferências

As transferências são implementadas como uma entidade própria (`Transfer`) que gera duas transações correlacionadas:
1. Uma transação de EXPENSE na conta de origem
2. Uma transação de INCOME na conta de destino

Ambas as transações são vinculadas pelo `transferId`, garantindo rastreabilidade e consistência. Uma categoria especial "Transfer" é criada automaticamente para identificar essas transações.

### Multi-tenancy

Todos os dados são isolados por usuário. Cada entidade possui um `userId` e todas as consultas filtram por este campo, garantindo que um usuário nunca acesse dados de outro.

### Tratamento de Erros

Erros de domínio são mapeados para códigos HTTP apropriados:
- `ValidationError` → 400 Bad Request
- `UnauthorizedError` → 401 Unauthorized
- `ForbiddenError` → 403 Forbidden
- `EntityNotFoundError` → 404 Not Found
- `ConflictError` → 409 Conflict

## Testes

### Testes Unitários

Localizados em `tests/domain/`, cobrem:
- Value Objects (Money, UniqueId)
- Entidades e suas regras de negócio
- Validações de domínio

### Testes de Integração

Localizados em `tests/integration/`, cobrem:
- Repositórios Prisma
- Filtros de transações
- Operações CRUD

### Executando Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Apenas unitários
npm test -- tests/domain

# Apenas integração
npm test -- tests/integration
```

## Docker

### Desenvolvimento

```bash
# Apenas PostgreSQL
docker-compose up -d postgres

# Aplicação completa
docker-compose up -d
```

### Produção

```bash
docker build -t finance-control-api .
docker run -p 3000:3000 --env-file .env finance-control-api
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente | development |
| `DATABASE_URL` | URL do PostgreSQL | - |
| `JWT_SECRET` | Segredo para JWT | - |
| `JWT_EXPIRES_IN` | Expiração do token | 7d |
| `LOG_LEVEL` | Nível de log | info |

## Licença

MIT
