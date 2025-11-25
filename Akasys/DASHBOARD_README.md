# Dashboard - Guia de Uso

## 📊 Funcionalidades Implementadas

### 1. Gráficos em Tempo Real
O Dashboard agora exibe três gráficos que consomem dados do backend:

- **Top Produtos** (Gráfico de Barras)
  - Endpoint: `GET /dash/top-produtos?limit=5`
  - Mostra os produtos mais vendidos
  
- **Vendas Mensais** (Gráfico de Linha)
  - Endpoint: `GET /dash/vendas-mensais`
  - Exibe a evolução das vendas ao longo dos meses
  
- **Estoque por Cliente** (Gráfico de Pizza)
  - Endpoint: `GET /dash/estoque-clientes`
  - Distribuição de estoque entre clientes

### 2. Upload de Dados
- Suporta arquivos CSV e JSON
- Barra de progresso em tempo real usando XMLHttpRequest
- Tipos de upload: Vendas ou Estoque
- Endpoint: `POST /upload/{tipo}` (tipo = vendas ou estoque)

### 3. Envio de Relatórios por E-mail
- Formulário com validação de campos
- Mensagens de erro detalhadas do servidor
- Endpoint: `POST /relatorios/enviar`

## 🚀 Como Usar

### Iniciar o Servidor de Desenvolvimento
```powershell
cd "c:\Users\dougl\OneDrive\Documentos\API_6-Semestre-Frontend-Web\Akasys"
npm run dev
```

Acesse: http://localhost:5173/

### Autenticação
Os endpoints de dashboard requerem autenticação. Certifique-se de:
1. Fazer login primeiro (o token será salvo em `localStorage` com chave `auth_token`)
2. O backend deve retornar um token JWT válido no endpoint `/login`

### Testando os Gráficos
1. Acesse a página de Dashboard após login
2. Os gráficos carregarão automaticamente ao montar o componente
3. Em caso de erro, verifique o console do navegador

### Testando Upload
1. Selecione o tipo de dataset (Vendas ou Estoque)
2. Escolha um arquivo CSV ou JSON
3. Clique em "Upload"
4. Observe a barra de progresso

### Testando Envio de E-mail
1. Preencha destinatário, assunto e mensagem
2. Clique em "Enviar Relatório"
3. A mensagem de sucesso/erro aparecerá ao lado do botão

## 🔧 Variáveis de Ambiente (.env)
```env
VITE_API_BASE_URL=https://api-6-semestre-backend.onrender.com
VITE_DASH_TOP_PRODUTOS=/dash/top-produtos
VITE_DASH_VENDAS_MENSAIS=/dash/vendas-mensais
VITE_DASH_ESTOQUE_CLIENTES=/dash/estoque-clientes
VITE_UPLOAD_ENDPOINT=/upload
VITE_RELATORIOS_ENDPOINT=/relatorios/enviar
VITE_AUTH_TOKEN_KEY=auth_token
```

## 📦 Dependências Instaladas
- `recharts` - Biblioteca de gráficos para React

## 🐛 Resolução de Problemas

### Erro "unsupported locale setting"
Este erro vem do backend Python. Adicione no início do arquivo principal da API:

```python
import locale

def safe_set_locale():
    for loc in ("pt_BR.UTF-8", "en_US.UTF-8", "C.UTF-8", "C"):
        try:
            locale.setlocale(locale.LC_ALL, loc)
            print(f"Locale definida: {loc}")
            return
        except locale.Error:
            continue
    print("Aviso: não foi possível definir locale")

safe_set_locale()
```

### Gráficos não carregam
- Verifique se o backend está rodando
- Confirme que o token de autenticação está presente no localStorage
- Verifique o console do navegador para erros de rede/CORS

### Upload sem progresso
- O progresso funciona via XMLHttpRequest
- Arquivos muito pequenos podem completar instantaneamente

## 📝 Estrutura de Resposta Esperada do Backend

### Top Produtos
```json
[
  { "produto": "Produto A", "quantidade": 150 },
  { "produto": "Produto B", "quantidade": 120 }
]
```

### Vendas Mensais
```json
[
  { "mes": "Jan", "total": 15000 },
  { "mes": "Fev", "total": 18000 }
]
```

### Estoque por Cliente
```json
[
  { "cliente": "Cliente A", "quantidade": 500 },
  { "cliente": "Cliente B", "quantidade": 300 }
]
```
