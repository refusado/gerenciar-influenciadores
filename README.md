Desenvolvimento fullstack em javascript com Node.js e React.js de um sistema administrativo de uma plataforma para influenciadores e marcas, possibilitando o gerenciamento de ambas entidades.

## Tabela de conteúdo
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos 1](#requisitos-1)
- [Requisitos 2](#requisitos-2)
- [Extras 1](#extras-1)
- [Extras 2](#extras-2)
- [Como usar](#como-usar-este-repositório) (clonar, configurar, testar, etc)

## funcionalidades
- sistema de autenticação para administradores
- autenticação para rotas da api e rotas web 
- CRUD para influenciadores e marcas
- associar influenciadores às marcas
- integração com viacep para localização de influenciadores
- ambiente de desenvolvimento nextjs para plataforma pública e privada
- SPAs com nextjs para rotas públicas e internas de forma isolada
- validação de dados no frontend e backend: formato de e-mail, CEP, tamanho de arquivo, etc.
- HTTP state na integração do backend no frontend e optimistic UI
- Documentação para API (JSON na especificação OpenAPI e visualização web com Swagger UI)

## tecnologias
- React.js para o frontend, usado o Next.js como SSG
- Fastify para desenvolvimento da API, servir a aplicação e seus recursos
- Typescript tanto no frontend quanto para o frontend para desenvolvimento mais escalável e seguro
- Prisma ORM para lidar com aspectos relacionados ao banco de dados
- Eslint com Prettier para garantir padronização e formatação do código e melhorar a experiência de desenvolvimento
- Axios para consumo tanto da API interna quanto APIs externas no frontend e no backend
- Zod para validação de dados e tipagens tanto no backend quanto no frontend integrado com typescript
- React Hook Form para lidar com conceitos avançados de formulários para inputs do frontend com React
- Tailwind CSS, Radix UI Primitives e Ark UI para facilitar e agilizar a criação e estilização das páginas web
- Phosphor Icons para exibição de ícones no frontend e proporcionar melhor experiência do usuário
- Tanstack Query no React para lidar com estado assíncrono (entre o frontend e backend)
- Dayjs para formatação de datas/horas no frontend e melhorar a visualização de dados
- Vitest para testes unitários e supertest para facilitar testes de requisições HTTP no backend
- Swagger para gerar documentação da API e Swagger UI para visualização da documentação gerada

## requisitos 1
- [x] cadastro de administradores: nome, email e senha
- [x] login/logout administradores
- [x] cadastro de influenciadores: nome, nicho, alcance, foto, nome de usuário do instagram, endereço
- [x] buscar detalhes do endereço do inflenciador com base no cep utilizando a api do viacep
- [x] listar influenciadores cadastrados
- [x] visualizar detalhes de um influenciador específico
- [x] alterar informações de um influenciador

## requisitos 2
- [x] cadastro de marcas: nome, descrição, nicho
- [x] listar marcas cadastradas
- [x] visualizar detalhes de uma marca específica
- [x] atualizar informações de uma marca
- [x] relacionar um influenciadores com marcas
- [ ] filtro de busca para influenciadores: nicho, alcance, data de cadastro e atualização

## extras 1
- [x] testes unitários backend
- [ ] testes unitários frontend
- [x] validações avançadas no frontend: campos obrigatórios, formatos, etc.
- [x] boas práticas de segurança no backend para prevenção SQL injection e XSS

## extras 2
- [ ] conteinerização: docker ou kubernetes
- [ ] CI/CD
- [ ] AWS: EC2, RDS, S3...
- [x] segurança para todos os níveis de desenvolvimento
- [x] logs e documentação

## Como usar este repositório

Antes de usar, é preciso ter 2 coisas instaladas:

- [Node.js](https://nodejs.org/) e [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)


### 1. Clone o repositório

```bash
git clone https://github.com/refusado/gerenciar-influenciadores.git
cd gerenciar-influenciadores
```

### 2. Instale as dependências do frontend e do backend

```bash
cd backend
npm install
```
e

```bash
cd ../frontend
npm install
```

### 3. Configure o backend

#### 3.1. variáveis de ambiente

Renomeie ou copie o arquivo `.env.example` no caminho `backend/` para `.env` e faça as alterações que achar necessário.

```bash
cd backend
cp .env.example .env
```

#### 3.2. banco de dados

Execute as migrations

```bash
npm run db:migrate-dev
```

Ou, se o banco de dados já estiver em produção:

```bash
npm run db:migrate
```

### 4. Execute em ambiente de desenvolvimento
 
Para rodar o servidor **backend** em modo de desenvolvimento, na pasta `backend`, execute:

```bash
npm run dev
```

Isso iniciará o servidor Fastify com a API do projeto na porta configurada. A documentação estará disponível na rota `api/docs`.

Para rodar o **frontend** em modo de desenvolvimento, execute:

```bash
npm run dev
```

O Next.js rodará a aplicação na porta `http://localhost:3000` (ou outra porta disponível).

> [!WARNING]
> Por padrão, o fronted irá usar o caminho `http://localhost:3333` para fazer as chamadas à API. Não configurei variáveis de ambiente no frontend, então se o seu servidor fastify estiver rodando em outra porta, muda o valor da constante **BASE_URL** no arquivo `consts.ts` que está no caminho `frontend/src/`

### 5. Execute os testes

```bash
npm run test
```

### 6. Build para produção

O servidor Fastify é usado para servir tanto a API quanto a aplicação web. O Next.js irá gerar o HTML necessário para as páginas e o fastify irá serví-lo como arquivos estáticos a partir das requisições correspondentes.

Para iniciar a aplicação em produção, **primero gere o build da aplicação web**:

```bash
cd frontend
npm run build
```
E então gere o build do servidor:

```bash
cd ..backend
npm run build
```

Isso irá clonar o HTML gerado pelo Next.js no diretório do servidor e criará um build otimizado da aplicação completa.

### 7. Servindo a aplicação em produção

Para rodar a aplicação em modo de produção, após o build:

```bash
cd backend
npm start
```

O backend irá servir o conteúdo estático gerado pelo frontend e também lidar com as APIs.

### Outros scripts disponíveis

- `npm run lint`
- `npm run lint:fix`
- `npm run db:generate`
- `npm run db:studio`
