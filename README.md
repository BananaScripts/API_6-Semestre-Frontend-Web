# BI Insights - Web Application

> Plataforma web de Business Intelligence com insights para Big Data de negócios utilizando IA.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)

## 📋 Sobre o Projeto

Versão web criada a partir das especificações do app mobile [API_6-Semestre-Frontend-Mobile](https://github.com/BananaScripts/API_6-Semestre-Frontend-Mobile). 

### Funcionalidades Principais

- 🔐 **Autenticação**: Login/Logout com JWT e proteção de rotas
- 📊 **Dashboard**: Métricas, gráficos, tabelas de estoque e receita
- 💬 **Chat**: Sistema de mensagens com busca e badges
- 👤 **Profile**: Gerenciamento de perfil e preferências
- 👑 **Admin**: CRUD completo de usuários (apenas para admins)
- 📱 **Responsivo**: Design adaptável para mobile, tablet e desktop
- 🌙 **Tema Escuro**: Interface minimalista com cores #000, #1A1A1A, #0F0F0F

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ e npm
- Git

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre na pasta
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:8080
```

### Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

### Testes

```bash
# Rodar todos os testes
npm test

# Testes com interface
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Rodar testes em watch mode
npm run test:watch
```

### Lint & Type Check

```bash
# Lint
npm run lint

# Type check
npm run typecheck
```

## 🏗️ Stack Tecnológica

- **Framework**: React 18.3 + Vite 5.0
- **Linguagem**: TypeScript 5.5
- **Estilização**: Tailwind CSS 3.4
- **Componentes UI**: shadcn/ui
- **Roteamento**: React Router 6.30
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Testes**: Vitest + Testing Library
- **Mocks**: MSW (Mock Service Worker)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn
│   ├── NavBar.tsx      # Barra de navegação
│   ├── MetricCard.tsx  # Card de métricas
│   └── ProtectedRoute.tsx
├── context/            # React Context
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Login/Signup
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Chat.tsx        # Lista de conversas
│   ├── ChatThread.tsx  # Thread de mensagens
│   ├── Profile.tsx     # Perfil do usuário
│   └── Admin.tsx       # Painel administrativo
├── services/           # Serviços
│   └── apiClient.ts    # Cliente Axios configurado
├── test/               # Configuração de testes
│   ├── setup.ts
│   └── mocks/
│       ├── handlers.ts # MSW handlers
│       └── server.ts   # MSW server
└── __tests__/          # Testes unitários
```

## 🔐 Autenticação

A aplicação usa autenticação JWT com as seguintes features:

- **Token Persistence**: Armazenado em `localStorage`
- **Auto-redirect**: Usuários não autenticados são redirecionados para `/login`
- **Role-based Access**: Controle de acesso por role (admin/user)
- **Auto-logout on 401**: Logout automático quando o token expira
- **Protected Routes**: Componente `ProtectedRoute` para rotas privadas

### Credenciais de Teste (Mock)

```javascript
// Usuário regular
email: test@example.com
password: password123

// Administrador
email: admin@example.com
password: admin123
```

## 🎨 Design System

### Cores Principais

```css
--background: #000000      /* Preto puro */
--card: #1A1A1A           /* Cards */
--surface: #0F0F0F        /* Inputs/surfaces */
--foreground: #FFFFFF     /* Texto principal */
--muted: #4A4A4A          /* Texto secundário */
--border: #2C2C2C         /* Bordas */
```

### Componentes Customizados

Todos os componentes shadcn foram customizados para seguir o design system. Os tokens semânticos estão definidos em:

- `src/index.css` - Variáveis CSS e cores HSL
- `tailwind.config.ts` - Configuração estendida do Tailwind

## 📡 Integração com Backend

### Configuração

Configure a URL base da API no arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Endpoints Esperados

Veja `ASSUMPTIONS.md` para a lista completa de endpoints esperados. Principais:

- `POST /api/auth/login` - Login
- `GET /api/users/me` - Dados do usuário
- `GET /api/users` - Listar usuários (admin)
- `POST /api/reports/send` - Enviar relatório
- `POST /api/upload` - Upload de arquivos

### Mocks para Desenvolvimento

A aplicação usa MSW para mockar endpoints durante desenvolvimento e testes. Os mocks estão em `src/test/mocks/handlers.ts`.

## 🧪 Testes

### Suites Implementadas

- **AuthContext**: Testes de contexto de autenticação
- **Login**: Testes de formulário de login
- **Dashboard**: Testes de renderização e interações
- **ProtectedRoute**: Testes de proteção de rotas

### Cobertura

```bash
npm run test:coverage
```

Cobertura mínima esperada: > 70% para fluxos críticos

## 📦 Deploy

### Lovable

Simplesmente clique em **Publish** no canto superior direito do editor.

### Custom Domain

1. Navegue para Project > Settings > Domains
2. Clique em "Connect Domain"
3. Siga as instruções

Mais informações: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 📝 Documentação Adicional

- [ASSUMPTIONS.md](./ASSUMPTIONS.md) - Endpoints inferidos e decisões técnicas
- [QA_REPORT.md](./QA_REPORT.md) - Relatório completo de QA
- [.env.example](./.env.example) - Template de variáveis de ambiente

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `chore:` Manutenção

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: Build falha

```bash
# Verifique tipos TypeScript
npm run typecheck

# Execute lint
npm run lint
```

### Testes falhando

```bash
# Limpe cache do vitest
npx vitest --clearCache

# Rode novamente
npm test
```

## 📄 Licença

Este projeto está sob a licença [Apache-2.0](./LICENSE).

## 👥 Time

Desenvolvido por **BananaScripts** como parte do projeto semestral de Insights para Big Data de Negócios com IA.

## 🔗 Links Úteis

- [Repositório Mobile](https://github.com/BananaScripts/API_6-Semestre-Frontend-Mobile)
- [Lovable Documentation](https://docs.lovable.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Project URL**: https://lovable.dev/projects/d406efab-4ba0-4ecc-a780-429221ae7597
