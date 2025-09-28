# 📱 AKASYS - Documentação Completa para Desenvolvimento Web

## 🎯 Visão Geral do Aplicativo

O **AKASYS** é um aplicativo mobile de **Business Intelligence e Analytics** voltado para insights de Big Data de negócios com IA. É uma plataforma completa de gerenciamento empresarial com foco em análise de dados e administração de usuários.

---

## 🏗️ Arquitetura e Estrutura do App

### 📁 **Estrutura de Pastas Principal**
```
AKASYS/
├── app/                    # Páginas principais do app
│   ├── _layout.tsx        # Layout raiz com AuthProvider
│   ├── login.tsx          # Tela de login
│   ├── modal.tsx          # Modal genérico
│   └── (tabs)/            # Navegação principal por abas
│       ├── _layout.tsx    # Layout das tabs
│       ├── index.tsx      # Dashboard principal
│       ├── admin.tsx      # Painel administrativo
│       ├── chat.tsx       # Sistema de chat
│       └── profile.tsx    # Perfil do usuário
│   └── profile/           # Subpáginas do perfil
│       ├── personal.tsx   # Informações pessoais
│       ├── password.tsx   # Alteração de senha
│       ├── notifications.tsx  # Configurações de notificação
│       ├── language.tsx   # Seleção de idioma
│       ├── contact.tsx    # Contato/suporte
│       └── about.tsx      # Sobre o app
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base da UI
│   ├── themed-*.tsx      # Componentes com tema
│   ├── AuthGuard.tsx     # Proteção de rotas
│   └── custom-tab-bar.tsx # Tab bar customizada
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Gerenciamento de autenticação
├── constants/            # Constantes e temas
│   └── theme.ts          # Sistema de cores e fontes
└── hooks/                # Hooks customizados
    └── use-*.ts          # Hooks utilitários
```

---

## 🔐 Sistema de Autenticação

### **AuthContext.tsx** - Gerenciamento Global de Autenticação
```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
```

**Funcionalidades:**
- ✅ Login simulado (admin@admin.com / 123456)
- 📱 Armazenamento local com AsyncStorage
- 🔄 Verificação de estado de autenticação
- 🚪 Logout com limpeza de dados
- ⏳ Estados de loading

### **AuthGuard.tsx** - Proteção de Rotas
- 🛡️ Verifica autenticação antes de renderizar conteúdo protegido
- 🔄 Redireciona para login se não autenticado
- ⏳ Mostra loading durante verificação

---

## 📄 Telas Principais

### 🏠 **1. Dashboard (index.tsx)**
**Funcionalidades principais:**
- 📊 **Cards de Métricas**:
  - Vendas do Mês (R$ 45.230)
  - Usuários Ativos (2.847)
  - Taxa de Conversão (3.24%)
  - Tempo Médio (4m 32s)

- 🚀 **Ações Rápidas**:
  - Relatórios
  - Analytics
  - Configurações
  - Suporte

- 📋 **Tabela de Dados de Usuários**:
  - Lista completa com nome, email, status, cargo, último login, receita
  - 🔍 Sistema de busca
  - 📊 Ordenação por colunas
  - 📱 Layout responsivo (cards no mobile, tabela no desktop)

- 📈 **Dados Recentes**:
  - Relatório de Vendas
  - Análise de Performance
  - Backup Automático
  - Atualizações

### 👨‍💼 **2. Painel Admin (admin.tsx)**
**Funcionalidades principais:**
- 👥 **Gerenciamento de Usuários**:
  - Lista completa de usuários
  - Status: Ativo, Inativo, Suspenso
  - Roles: Admin, Moderador, Usuário
  - Último login e avatar

- 📊 **Estatísticas**:
  - Total de usuários
  - Usuários ativos
  - Usuários inativos

- 🔍 **Sistema de Filtros**:
  - Busca por nome/email
  - Filtros por status (Todos, Ativos, Inativos, Suspensos)

- ⚡ **Ações Rápidas**:
  - Novo Usuário
  - Importar usuários
  - Exportar dados
  - Configurações

### 💬 **3. Chat (chat.tsx)**
**Funcionalidades principais:**
- 📞 **Lista de Conversas**:
  - Avatar e status online
  - Última mensagem
  - Timestamp
  - Contador de mensagens não lidas
  - Badge de mensagens não lidas

- 🔍 **Busca de Conversas**:
  - Busca em tempo real por nome
  - Limpar busca com botão X

- 👥 **Tipos de Conversa**:
  - Conversas individuais
  - Grupos (Equipe Dev)
  - Status online/offline

- ➕ **Nova Conversa**:
  - Botão flutuante (FAB)
  - Botão no header

### 👤 **4. Perfil Principal (profile.tsx)**
**Funcionalidades principais:**
- 👤 **Informações do Usuário**:
  - Avatar, nome, email
  - Data de membro desde

- 📋 **Seções Organizadas**:
  - **Conta**: Informações Pessoais, Alterar Senha
  - **Preferências**: Notificações, Idioma
  - **Suporte**: Fale Conosco, Sobre

- 🚪 **Logout com Confirmação**

---

## 📄 Subpáginas do Perfil

### 👨‍💼 **5. Informações Pessoais (personal.tsx)**
- 📝 Formulário completo: nome, email, telefone, endereço, cidade, estado, CEP
- 💾 Simulação de salvamento
- 📱 Layout de formulário responsivo

### 🔐 **6. Alterar Senha (password.tsx)**
- 🔒 Campo senha atual
- 🔒 Nova senha com confirmação
- 👁️ Toggle mostrar/ocultar senhas
- ✅ Validações de segurança

### 🔔 **7. Notificações (notifications.tsx)**
**Categorias de Notificação:**
- 📱 **Gerais**: Push, Email, SMS
- 🔐 **Segurança**: Alertas de segurança
- 🆕 **Atualizações**: Updates do sistema
- 📢 **Marketing**: Promoções e ofertas

**Funcionalidades:**
- 🎚️ Switches para cada categoria
- 📊 Configurações granulares
- 💾 Salvamento de preferências

### 🌍 **8. Idioma (language.tsx)**
**Idiomas Disponíveis:**
- 🇧🇷 Português (Brasil) - Padrão
- 🇺🇸 English (United States)
- 🇪🇸 Español (España)
- 🇫🇷 Français (France)

**Funcionalidades:**
- 🎯 Seleção visual com bandeiras
- ✅ Indicador de idioma ativo
- 🔄 Aplicação imediata

### 📞 **9. Contato/Suporte (contact.tsx)**
**Métodos de Contato:**
- 📧 Email (resposta em 24h)
- 📱 WhatsApp (resposta imediata)
- ☎️ Telefone (Seg-Sex, 9h-18h)

**Formulário de Contato:**
- 📋 Categorias: Geral, Técnico, Cobrança, Sugestão, Bug
- 📝 Campos: Nome, email, assunto, mensagem
- 📤 Envio simulado

### ℹ️ **10. Sobre (about.tsx)**
**Informações do App:**
- 📱 Versão atual (1.0.0)
- 👥 Informações da empresa
- 🌟 Funcionalidades principais
- 📊 Links sociais e website

**Ações:**
- ⭐ Avaliar app na store
- 📤 Compartilhar app
- 📋 Política de privacidade/termos

---

## 🧩 Componentes Reutilizáveis

### 🎨 **Componentes Themed**

#### **ThemedView**
```typescript
interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}
```
- 🎨 View que adapta cor de fundo automaticamente ao tema

#### **ThemedText**
```typescript
interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'highlight';
}
```
- 📝 Texto com tipos pré-definidos e cores automáticas

### 🎛️ **Componentes de UI**

#### **IconSymbol**
- 🎯 Sistema de ícones unificado
- 📱 Compatibilidade iOS/Android/Web
- 🎨 Cores e tamanhos dinâmicos

#### **Collapsible**
```typescript
interface CollapsibleProps {
  title: string;
  children: ReactNode;
}
```
- 📂 Componente expansível/retrátil
- 🔄 Animação de rotação do ícone
- 🎨 Integrado com tema

#### **Custom Tab Bar**
- 🎯 Tab bar personalizada com haptic feedback
- ✨ Animações e indicadores visuais
- 📱 Estados ativo/inativo
- 🎨 Cores adaptáveis ao tema

### 🔒 **Componentes de Segurança**

#### **AuthGuard**
- 🛡️ Proteção de rotas autenticadas
- ⏳ Loading states
- 🔄 Redirecionamento automático

---

## 🎨 Sistema de Tema e Design

### 🌈 **Paleta de Cores (theme.ts)**

#### **Cores Principais**
```typescript
const primaryBlue = '#303B5A';    // Azul principal
const highlightGold = '#EEEA99';  // Dourado de destaque
```

#### **Modo Claro**
```typescript
light: {
  text: '#11181C',
  background: '#fff',
  tint: '#0a7ea4',
  icon: '#687076',
  border: '#E1E5E9',
  card: '#F8F9FA',
  surface: '#FFFFFF',
  muted: '#6C757D',
  accent: '#0D6EFD',
  primary: primaryBlue,
  highlight: highlightGold,
}
```

#### **Modo Escuro** (Padrão)
```typescript
dark: {
  text: '#FFFFFF',
  background: '#000000',
  tint: '#FFFFFF',
  icon: '#6C6C6C',
  border: '#2C2C2C',
  card: '#1A1A1A',
  surface: '#0F0F0F',
  muted: '#4A4A4A',
  accent: '#FFFFFF',
  primary: primaryBlue,
  highlight: highlightGold,
}
```

### 🔤 **Tipografia**
```typescript
// Web fonts
sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
serif: "Georgia, 'Times New Roman', serif"
mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
```

---

## 📊 Dados e Estado da Aplicação

### 📈 **Dados do Dashboard**
```typescript
// Métricas principais
const dashboardCards = [
  { title: 'Vendas do Mês', value: 'R$ 45.230', change: '+12.5%', trend: 'up' },
  { title: 'Usuários Ativos', value: '2.847', change: '+8.2%', trend: 'up' },
  { title: 'Taxa de Conversão', value: '3.24%', change: '-2.1%', trend: 'down' },
  { title: 'Tempo Médio', value: '4m 32s', change: '+15.3%', trend: 'up' }
];

// Tabela de usuários (6 usuários mock)
const tableData = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'Ativo', role: 'Admin', revenue: 'R$ 12.500' }
  // ... mais usuários
];
```

### 👥 **Dados de Usuários (Admin)**
```typescript
const users = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2 horas atrás',
    avatar: 'person.circle.fill'
  }
  // ... mais usuários
];
```

### 💬 **Dados de Chat**
```typescript
const conversations = [
  {
    id: 1,
    name: 'João Silva',
    lastMessage: 'Obrigado pela ajuda!',
    time: '2 min',
    unread: 2,
    online: true
  }
  // ... mais conversas
];
```

---

## 🚀 Funcionalidades Avançadas

### 🔍 **Sistema de Busca**
- **Dashboard**: Busca e ordenação na tabela de usuários
- **Admin**: Filtros por nome/email e status
- **Chat**: Busca de conversas em tempo real

### 📊 **Ordenação de Dados**
```typescript
const sortData = (data: any[], field: string, order: string) => {
  return [...data].sort((a, b) => {
    // Tratamento especial para valores monetários
    if (field === 'revenue') {
      aVal = parseFloat(aVal.replace('R$ ', '').replace('.', ''));
    }
    return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });
};
```

### 📱 **Responsividade**
- **Mobile**: Layout em cards verticais
- **Desktop**: Tabelas horizontais completas
- **Breakpoint**: 768px
```typescript
{width < 768 ? (
  // Layout mobile com cards
) : (
  // Layout desktop com tabelas
)}
```

### 🎯 **Micro-interações**
- **Haptic Feedback**: Vibração nos toques (iOS/Android)
- **Loading States**: Estados de carregamento em ações
- **Animações**: Transições suaves entre estados
- **Toast/Alerts**: Feedback visual para ações

---

## 🛠️ Implementação para Web

### 📋 **Checklist de Componentes Web**

#### **🏗️ Estrutura Base**
- [ ] Roteamento (React Router / Next.js)
- [ ] Context API para autenticação
- [ ] Sistema de temas (CSS Variables)
- [ ] Componentes styled-components/CSS-in-JS

#### **🔐 Autenticação**
- [ ] AuthContext com localStorage
- [ ] Login form com validação
- [ ] Protected routes (AuthGuard)
- [ ] Logout com confirmação

#### **📄 Páginas Principais**
- [ ] Dashboard com métricas e tabela
- [ ] Painel admin com gestão de usuários
- [ ] Sistema de chat/mensagens
- [ ] Perfil com subpáginas

#### **🧩 Componentes**
- [ ] ThemedView → div with CSS classes
- [ ] ThemedText → span/p with typography classes
- [ ] IconSymbol → SVG icon system
- [ ] Collapsible → accordion component
- [ ] Custom navigation → navbar/sidebar

#### **🎨 Design System**
- [ ] CSS Variables para cores
- [ ] Sistema de tipografia
- [ ] Grid system responsivo
- [ ] Componentes de formulário
- [ ] Cards e layouts

#### **📊 Funcionalidades**
- [ ] Tabelas com ordenação
- [ ] Sistema de busca/filtros
- [ ] Estados de loading
- [ ] Formulários validados
- [ ] Notificações/toasts

### 💡 **Sugestões de Tecnologias**

**Frontend Framework:**
- ⚛️ React + TypeScript
- 🚀 Next.js (recomendado)
- 🎨 Styled-components ou CSS Modules

**UI Libraries:**
- 🎨 Chakra UI
- 🏗️ Material-UI
- 🎯 Ant Design
- 💎 Tailwind CSS

**Gerenciamento de Estado:**
- 🔄 Context API + useReducer
- 📦 Zustand
- 🗃️ Redux Toolkit

**Roteamento:**
- 🛣️ React Router v6
- 📄 Next.js Router (built-in)

---

## 📝 Resumo Executivo

O **AKASYS** é uma aplicação completa de **Business Intelligence** com:

### 🎯 **5 Telas Principais**
1. **Dashboard** - Métricas e dados analíticos
2. **Admin** - Gerenciamento de usuários
3. **Chat** - Sistema de mensagens
4. **Perfil** - Configurações pessoais
5. **Login** - Autenticação

### 📱 **6 Subpáginas de Configuração**
1. Informações Pessoais
2. Alterar Senha  
3. Notificações
4. Idioma
5. Contato/Suporte
6. Sobre

### 🧩 **20+ Componentes Reutilizáveis**
- Themed components (View, Text)
- UI components (Icons, Collapsible)
- Navigation components (TabBar, Guards)
- Form components (Inputs, Buttons)

### 🎨 **Sistema de Design Completo**
- Paleta de cores light/dark
- Tipografia responsiva
- Componentes themed
- Micro-interações

### 📊 **Dados Mock Estruturados**
- Usuários com diferentes roles
- Métricas de dashboard
- Conversas de chat
- Configurações de perfil

Este é um aplicativo **enterprise-ready** perfeito para ser replicado como versão web, mantendo toda a funcionalidade e design system consistente entre plataformas! 🚀

<function_calls>
<invoke name="manage_todo_list">
<parameter name="operation">write