# AKASYS - Design System & Identidade Visual

## 🎨 Análise da Identidade Visual do Projeto Mobile

Este documento descreve a identidade visual do projeto mobile AKASYS e fornece diretrizes para replicar o design em um projeto web.

---

## 🌈 Paleta de Cores

### Cores Principais
- **Primary Blue (Azul Principal)**: `#303B5A` - Cor primária para elementos de destaque
- **Highlight Gold (Dourado de Destaque)**: `#EEEA99` - Cor de destaque e acentos especiais

### Modo Claro (Light Theme)
```css
:root[data-theme="light"] {
  --color-text: #11181C;
  --color-background: #ffffff;
  --color-tint: #0a7ea4;
  --color-icon: #687076;
  --color-tab-icon-default: #687076;
  --color-tab-icon-selected: #0a7ea4;
  --color-border: #E1E5E9;
  --color-card: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-muted: #6C757D;
  --color-accent: #0D6EFD;
  --color-highlight: #EEEA99;
  --color-primary: #303B5A;
}
```

### Modo Escuro (Dark Theme)
```css
:root[data-theme="dark"] {
  --color-text: #FFFFFF;
  --color-background: #000000;
  --color-tint: #FFFFFF;
  --color-icon: #6C6C6C;
  --color-tab-icon-default: #6C6C6C;
  --color-tab-icon-selected: #FFFFFF;
  --color-border: #2C2C2C;
  --color-card: #1A1A1A;
  --color-surface: #0F0F0F;
  --color-muted: #4A4A4A;
  --color-accent: #FFFFFF;
  --color-highlight: #EEEA99;
  --color-primary: #303B5A;
}
```

---

## 📱 Tipografia

### Fontes Recomendadas para Web
```css
/* Sans-serif principal */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

/* Serif para títulos especiais */
font-family: Georgia, 'Times New Roman', serif;

/* Monospace para códigos */
font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

### Hierarquia de Textos
```css
.text-default {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.text-default-semibold {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}

.text-title {
  font-size: 32px;
  font-weight: bold;
  line-height: 32px;
}

.text-subtitle {
  font-size: 20px;
  font-weight: bold;
}

.text-link {
  font-size: 16px;
  line-height: 30px;
  color: var(--color-primary);
}

.text-highlight {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-highlight);
}
```

---

## 🎭 Componentes e Padrões de Design

### 1. Cards (Cartões)
```css
.card {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-dashboard {
  background-color: var(--color-card);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-dashboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 2. Botões
```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.button-primary:hover {
  opacity: 0.9;
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 3. Inputs (Campos de Entrada)
```css
.input-container {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-surface);
  margin-bottom: 16px;
  transition: border-color 0.2s ease;
}

.input-container:focus-within {
  border-color: var(--color-primary);
}

.input-container input {
  flex: 1;
  border: none;
  outline: none;
  margin-left: 12px;
  font-size: 16px;
  background: transparent;
  color: var(--color-text);
}

.input-container input::placeholder {
  color: var(--color-muted);
}
```

### 4. Navegação/Tabs
```css
.tab-bar {
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 10px 0 15px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-around;
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 12px;
  min-width: 60px;
  position: relative;
  transition: all 0.2s ease;
}

.tab-button.active {
  background-color: rgba(var(--color-tint-rgb), 0.15);
  transform: scale(1.05);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: var(--color-tint);
  border-radius: 2px;
}

.tab-label {
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
  color: var(--color-tab-icon-default);
}

.tab-button.active .tab-label {
  color: var(--color-tab-icon-selected);
}
```

---

## 📊 Layout e Espaçamento

### Sistema de Grid
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsividade */
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

### Espaçamentos Padrão
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}

.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }
```

---

## 🌓 Implementação do Theme Toggle

```css
/* Transições suaves para mudança de tema */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

/* Theme toggle button */
.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--color-icon);
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: var(--color-surface);
}
```

```javascript
// Função JavaScript para alternar temas
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Aplicar tema salvo ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
```

---

## 🚀 Exemplo de Implementação Completa

### HTML Structure
```html
<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AKASYS Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <!-- Dashboard Cards -->
    <div class="grid grid-4">
      <div class="card-dashboard">
        <h3 class="text-subtitle">Vendas do Mês</h3>
        <p class="text-title">R$ 45.230</p>
        <span class="text-highlight">+12.5%</span>
      </div>
      <!-- Mais cards... -->
    </div>
    
    <!-- Login Form -->
    <div class="card">
      <div class="input-container">
        <svg><!-- ícone email --></svg>
        <input type="email" placeholder="Email">
      </div>
      
      <div class="input-container">
        <svg><!-- ícone senha --></svg>
        <input type="password" placeholder="Senha">
        <button type="button"><!-- ícone olho --></button>
      </div>
      
      <button class="button-primary">Entrar</button>
    </div>
    
    <!-- Tab Navigation -->
    <nav class="tab-bar">
      <button class="tab-button active">
        <svg><!-- ícone dashboard --></svg>
        <span class="tab-label">Dashboard</span>
      </button>
      <!-- Mais tabs... -->
    </nav>
  </div>
  
  <script src="theme.js"></script>
</body>
</html>
```

---

## 🎯 Características Principais da Identidade AKASYS

1. **Minimalismo Profissional**: Design limpo com foco na funcionalidade
2. **Contraste Elegante**: Uso predominante do modo escuro com acentos dourados
3. **Bordas Arredondadas**: Border-radius de 12px como padrão
4. **Sombras Sutis**: Elevação sutil para criar hierarquia
5. **Transições Suaves**: Micro-interações com transições de 0.2s-0.3s
6. **Responsividade**: Layout adaptativo para diferentes telas
7. **Acessibilidade**: Cores com contraste adequado e elementos focáveis

Este sistema de design mantém a coerência visual entre as plataformas mobile e web, garantindo uma experiência unificada para os usuários do AKASYS.