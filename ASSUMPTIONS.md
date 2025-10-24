# Suposições e Decisões de Implementação

## Endpoints da API (Inferidos)

Como o repositório mobile não estava acessível, os seguintes endpoints foram inferidos baseados nas funcionalidades padrão de uma aplicação de Business Intelligence:

### Autenticação
- `POST /api/auth/login` - Login de usuário
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: User }`

- `POST /api/auth/signup` - Registro de novo usuário
  - Body: `{ name: string, email: string, password: string }`
  - Response: `{ token: string, user: User }`

- `GET /api/auth/me` ou `GET /api/users/me` - Obter dados do usuário autenticado
  - Headers: `Authorization: Bearer {token}`
  - Response: `User`

### Usuários (Admin)
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Relatórios
- `GET /api/reports` - Listar relatórios
- `POST /api/reports/send` - Enviar relatório por email
  - Response: `{ success: boolean }`

### Upload
- `POST /api/upload` - Upload de arquivos CSV/Excel
  - Content-Type: `multipart/form-data`
  - Response: `{ success: boolean, filename: string }`

### Chat (Mensagens)
- `GET /api/conversations` - Listar conversas
- `GET /api/conversations/:id/messages` - Mensagens de uma conversa
- `POST /api/conversations/:id/messages` - Enviar mensagem

## Decisões Técnicas

### 1. WebSocket vs Polling
**Decisão**: Implementado com dados mockados localmente para o chat.
**Razão**: Não foi possível determinar se o backend usa WebSockets. A implementação atual usa estado local do React.
**Próximos Passos**: Quando o backend estiver disponível, integrar com socket.io-client se usar WebSockets, ou com polling se usar REST.

### 2. Autenticação
**Decisão**: Implementado AuthContext com localStorage para persistência de token.
**Features**:
- Login/Logout
- Proteção de rotas
- Verificação de role (admin/user)
- Redirect automático para /dashboard após login
- Interceptor axios para adicionar token em todas as requisições
- Tratamento de 401 (não autorizado)

### 3. Design System
**Decisão**: Tema escuro minimalista seguindo as especificações.
**Cores principais**:
- Background: `#000000`
- Card: `#1A1A1A` 
- Surface: `#0F0F0F`
- Text: `#FFFFFF`
- Muted: `#4A4A4A`
- Border: `#2C2C2C`

### 4. Estrutura de Pastas
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── NavBar.tsx
│   ├── MetricCard.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Chat.tsx
│   ├── ChatThread.tsx
│   ├── Profile.tsx
│   └── Admin.tsx
├── services/
│   └── apiClient.ts
└── App.tsx
```

### 5. Dados Mockados
Como não foi possível acessar o repositório mobile para ver os dados exatos, foram criados dados de exemplo para:
- Métricas do dashboard (vendas, usuários, conversão, tempo médio)
- Tabela de estoque
- Tabela de receita
- Atividades recentes
- Conversas do chat
- Usuários (na página Admin)

### 6. Funcionalidades Implementadas

#### ✅ Login
- Página de login/signup
- Validação de campos
- Feedback de erros
- Redirect automático

#### ✅ Dashboard
- 4 cards de métricas com trends
- Atividades recentes
- Tabela de receita mensal
- Tabela de estoque
- Botão enviar relatório
- Upload de arquivos

#### ✅ Chat
- Lista de conversas
- Busca de conversas
- Badges de mensagens não lidas
- Navegação para thread individual
- Interface de mensagens
- Campo de envio de mensagens

#### ✅ Profile
- Informações do usuário
- Seções organizadas (Conta, Preferências, Suporte)
- Botão de logout

#### ✅ Admin
- CRUD completo de usuários
- Busca e filtros (status)
- Modal de criação/edição
- Confirmação de exclusão
- Badges de status e role

### 7. NavBar
- Responsiva (mobile e desktop)
- Links ativos destacados
- Menu hamburguer no mobile
- Link Admin visível apenas para admins

## Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Próximos Passos

1. **Conectar com backend real**:
   - Atualizar `apiClient.ts` com a URL correta
   - Ajustar os endpoints conforme documentação do backend
   - Implementar tratamento de erros específico

2. **Implementar WebSocket para chat** (se aplicável):
   - Adicionar `socket.io-client`
   - Criar `services/socket.ts`
   - Conectar eventos de mensagens

3. **Testes**:
   - Adicionar Jest e React Testing Library
   - Testes de login/logout
   - Testes de rotas protegidas
   - Testes de CRUD de usuários

4. **Melhorias**:
   - Paginação nas tabelas
   - Filtros avançados
   - Gráficos (recharts)
   - Exportação de dados
   - Upload com progress bar
   - Validação de formulários com zod
   - Toast notifications mais detalhadas

## Comandos

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Rodar testes
npm test

# Testes com UI
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Lint
npm run lint

# Type check
npm run typecheck
```

## Scripts Necessários no package.json

Adicione os seguintes scripts ao `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit"
  }
}
```
