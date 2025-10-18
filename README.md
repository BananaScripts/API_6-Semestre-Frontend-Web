# Akasys - Frontend Web

Plataforma de Business Intelligence com interface web responsiva, sincronizada com a versão mobile.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação completa** com login/logout e proteção de rotas
- **Dashboard executivo** com insights em tempo real dos dados
- **Chat com IA** para análise de dados e suporte
- **Upload de dados** (CSV) para vendas e estoque
- **Geração e envio de relatórios** por email
- **Gestão de usuários** (CRUD completo para administradores)
- **Perfil do usuário** com logout funcional
- **Design responsivo** com tema azul e dourado
- **Navegação lateral** presente em todas as páginas

### 🔧 Tecnologias
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes
- **React Router** para navegação
- **React Query** para gerenciamento de estado
- **Lucide React** para ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend FastAPI rodando em `http://192.168.1.7:8000`

## 🛠️ Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
O projeto está configurado para usar o proxy do Vite que redireciona `/api/*` para `http://192.168.1.7:8000`.

### 3. Executar em desenvolvimento
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:5173`

### 4. Build para produção
```bash
npm run build
```

### 5. Preview da build
```bash
npm run preview
```

## 🔗 Integração com Backend

O projeto está configurado para se comunicar com o backend FastAPI através do proxy do Vite:

- **URL Base**: `http://192.168.1.7:8000`
- **Proxy**: `/api/*` → `http://192.168.1.7:8000/*`

### Endpoints utilizados:
- `POST /login` - Autenticação
- `GET /vendas` - Dados de vendas
- `GET /estoque` - Dados de estoque
- `POST /upload/{tipo}` - Upload de arquivos CSV
- `POST /relatorios/enviar` - Envio de relatórios por email
- `GET /usuario/{id}` - Buscar usuário
- `POST /usuario` - Criar usuário
- `PUT /usuario/{id}` - Atualizar usuário
- `DELETE /usuario/{id}` - Excluir usuário

## 🎨 Design System

### Cores Principais
- **Azul Escuro**: `#303B5A` (primary)
- **Dourado**: `#EEEA99` (accent)
- **Modo Escuro**: Ativado por padrão

### Componentes
- Cards com elevação e sombras
- Botões com variantes (golden, outline, ghost)
- Inputs com foco dourado
- Tabelas responsivas
- Modais e dialogs
- Navegação lateral colapsível

## 📱 Sincronização com Mobile

A versão web foi sincronizada com o app mobile React Native:

- **Mesma paleta de cores** (azul e dourado)
- **Mesma estrutura de navegação** (tabs → sidebar)
- **Mesmas funcionalidades** (chat, dashboard, admin, perfil)
- **Mesma lógica de autenticação**
- **Mesmos endpoints** do backend

## 🔐 Autenticação

- Login obrigatório para acessar as páginas
- Token JWT armazenado no localStorage
- Redirecionamento automático para login se não autenticado
- Logout limpa token e redireciona para login

## 👥 Gestão de Usuários

### Para Administradores:
- Visualizar lista de usuários
- Criar novos usuários
- Editar informações de usuários
- Excluir usuários
- Buscar usuários por nome/email

### Para Usuários:
- Visualizar e editar perfil próprio
- Alterar senha
- Configurar notificações
- Fazer logout

## 📊 Dashboard

- **Métricas em tempo real** de vendas e estoque
- **Tabelas interativas** com dados do backend
- **Insights automáticos** baseados nos dados
- **Ações rápidas** para upload e relatórios
- **Status do sistema** e conectividade

## 💬 Chat

- **Lista de conversas** com busca
- **Chat individual** com IA
- **Indicadores de status** (online/offline)
- **Contadores de mensagens** não lidas
- **Interface responsiva** para desktop e mobile

## 📁 Upload de Dados

- **Drag & drop** para arquivos CSV
- **Detecção automática** do tipo (vendas/estoque)
- **Progress bar** durante upload
- **Feedback visual** de sucesso/erro
- **Fila de uploads** múltiplos

## 📧 Relatórios

- **Geração sob demanda** de relatórios
- **Envio por email** com anexos CSV
- **Configuração personalizada** de assunto e mensagem
- **Tipos de relatório**: vendas, estoque, completo

## 🚨 Troubleshooting

### Erro de conexão com backend
1. Verifique se o backend está rodando em `http://192.168.1.7:8000`
2. Confirme se o IP está correto no `vite.config.ts`
3. Verifique se não há firewall bloqueando a conexão

### Erro de CORS
O proxy do Vite resolve automaticamente problemas de CORS em desenvolvimento.

### Problemas de autenticação
1. Limpe o localStorage do navegador
2. Verifique se o token está sendo salvo corretamente
3. Confirme se o backend está retornando o token no formato correto

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm run lint` - Verificação de linting

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.