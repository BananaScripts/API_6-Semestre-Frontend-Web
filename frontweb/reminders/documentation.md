# Dom Rock Backend API - Routes & Schemas

## Base URL
```
http://127.0.0.1:8000
```

## Authentication
- Uses **JWT Bearer Token** authentication
- Login returns `access_token` and `token_type: "bearer"`
- Include in headers: `Authorization: Bearer <token>`

---

## 🔐 Authentication Routes

### POST `/login`
**Login user and get JWT token**
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body**:
  ```
  username=user@email.com
  password=userpassword
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here",
    "token_type": "bearer"
  }
  ```

---

## 👤 User Management Routes

### POST `/usuario`
**Create new user**
- **Method**: POST
- **Body**:
  ```json
  {
    "nome": "User Name",
    "email": "user@email.com",
    "senha": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "nome": "User Name",
    "email": "user@email.com"
  }
  ```

### GET `/usuario/{usuario_id}`
**Get user by ID**
- **Method**: GET
- **Path Params**: `usuario_id` (integer)
- **Response**:
  ```json
  {
    "id": 1,
    "nome": "User Name",
    "email": "user@email.com"
  }
  ```

### PUT `/usuario/{usuario_id}`
**Update user**
- **Method**: PUT
- **Path Params**: `usuario_id` (integer)
- **Body** (all fields optional):
  ```json
  {
    "nome": "New Name",
    "email": "new@email.com",
    "senha": "newpassword"
  }
  ```

### DELETE `/usuario/{usuario_id}`
**Delete user**
- **Method**: DELETE
- **Path Params**: `usuario_id` (integer)
- **Response**: 204 No Content

---

## 📊 Data Routes

### GET `/vendas`
**Get sales data with pagination**
- **Method**: GET
- **Query Params**: 
  - `skip` (optional, default: 0, min: 0)
  - `limit` (optional, default: 10, min: 1, max: 100)
- **Response**:
  ```json
  [
    {
      "id_venda": 1,
      "data": "2023-09-29",
      "cod_cliente": "CLI001",
      "cod_produto": "PROD001",
      "lote": "L001",
      "origem": "SP",
      "zs_gr_mercad": "Grupo A",
      "produto": "Produto X",
      "zs_centro": "Centro 1",
      "zs_cidade": "São Paulo",
      "zs_uf": "SP",
      "sku": "SKU001",
      "zs_peso_liquido": 10.5,
      "giro_sku_cliente": 5.2
    }
  ]
  ```

### GET `/estoque`
**Get inventory data with pagination**
- **Method**: GET
- **Query Params**: 
  - `skip` (optional, default: 0, min: 0)
  - `limit` (optional, default: 10, min: 1, max: 100)
- **Response**:
  ```json
  [
    {
      "id_estoque": 1,
      "data": "2023-09-29",
      "cod_cliente": "CLI001",
      "cod_produto": "PROD001",
      "es_centro": "Centro 1",
      "tipo_material": "Materia Prima",
      "origem": "SP",
      "lote": "L001",
      "dias_em_estoque": 30,
      "produto": "Produto X",
      "grupo_mercadoria": "Grupo A",
      "es_totalestoque": 100.0,
      "sku": "SKU001"
    }
  ]
  ```

---

## 📁 File Upload Routes

### POST `/upload/{tipo}`
**Upload CSV files (sales or inventory)**
- **Method**: POST
- **Path Params**: `tipo` (must be "vendas" or "estoque")
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with file upload
- **Response**:
  ```json
  {
    "status": "sucesso",
    "arquivo": "filename.csv",
    "tipo": "vendas"
  }
  ```

---

## 📧 Email/Reports Routes

### POST `/relatorios/enviar`
**Generate and send reports via email**
- **Method**: POST
- **Query Params**:
  - `assunto` (string) - Email subject
  - `corpo` (string) - Email body
- **Body**:
  ```json
  {
    "email": "recipient@email.com"
  }
  ```
- **Response**:
  ```json
  {
    "status": "sucesso",
    "msg": "Relatórios enviados para recipient@email.com"
  }
  ```

---

## 🏥 Health Check

### GET `/`
**Check if API is running**
- **Method**: GET
- **Response**:
  ```json
  {
    "status": "ok",
    "msg": "API funfando"
  }
  ```

---

## 📋 Database Schema

### Tables Structure

#### `clientes`
```sql
cod_cliente VARCHAR(50) PRIMARY KEY
```

#### `produtos`
```sql
cod_produto VARCHAR(50) PRIMARY KEY
```

#### `vendas`
```sql
id_venda SERIAL PRIMARY KEY,
data DATE NOT NULL,
cod_cliente VARCHAR(50) NOT NULL,
cod_produto VARCHAR(50) NOT NULL,
lote VARCHAR(50),
origem VARCHAR(100),
zs_gr_mercad VARCHAR(100),
produto VARCHAR(100),
zs_centro VARCHAR(50),
zs_cidade VARCHAR(100),
zs_uf VARCHAR(2),
SKU VARCHAR(50),
zs_peso_liquido DECIMAL(18,8),
giro_sku_cliente DECIMAL(18,8),
FOREIGN KEY (cod_cliente) REFERENCES clientes (cod_cliente),
FOREIGN KEY (cod_produto) REFERENCES produtos (cod_produto)
```

#### `estoque`
```sql
id_estoque SERIAL PRIMARY KEY,
data DATE NOT NULL,
cod_cliente VARCHAR(50) NOT NULL,
cod_produto VARCHAR(50) NOT NULL,
es_centro VARCHAR(50),
tipo_material VARCHAR(100),
origem VARCHAR(100),
lote VARCHAR(50),
dias_em_estoque INT,
produto VARCHAR(100),
grupo_mercadoria VARCHAR(100),
es_totalestoque DECIMAL(18,8),
SKU VARCHAR(50),
FOREIGN KEY (cod_cliente) REFERENCES clientes (cod_cliente),
FOREIGN KEY (cod_produto) REFERENCES produtos (cod_produto)
```

#### `usuario`
```sql
id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(100) NOT NULL
```

---

## 📝 Data Models

### Usuario (User)
```typescript
interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string; // Only for creation/update
}

interface CreateUsuario {
  nome: string;
  email: string;
  senha: string;
}

interface UpdateUsuario {
  nome?: string;
  email?: string;
  senha?: string;
}
```

### Venda (Sale)
```typescript
interface Venda {
  id_venda: number;
  data: string; // Date in YYYY-MM-DD format
  cod_cliente: string;
  cod_produto: string;
  lote?: string;
  origem?: string;
  zs_gr_mercad?: string;
  produto?: string;
  zs_centro?: string;
  zs_cidade?: string;
  zs_uf?: string;
  sku?: string;
  zs_peso_liquido?: number;
  giro_sku_cliente?: number;
}
```

### Estoque (Inventory)
```typescript
interface Estoque {
  id_estoque: number;
  data: string; // Date in YYYY-MM-DD format
  cod_cliente: string;
  cod_produto: string;
  es_centro?: string;
  tipo_material?: string;
  origem?: string;
  lote?: string;
  dias_em_estoque?: number;
  produto?: string;
  grupo_mercadoria?: string;
  es_totalestoque?: number;
  sku?: string;
}
```

### Email
```typescript
interface Email {
  email: string;
}
```

### Upload Types
```typescript
enum Upload {
  vendas = "vendas",
  estoque = "estoque"
}
```

---

## ⚠️ Error Responses

### Common HTTP Status Codes
- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **204**: No Content - Resource deleted successfully
- **400**: Bad Request - Invalid data sent
- **401**: Unauthorized - Invalid credentials or missing authentication
- **404**: Not Found - Resource doesn't exist
- **409**: Conflict - Email already registered
- **500**: Internal Server Error - Server-side error

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## 🔧 Environment Setup

### Required Environment Variables (.env file)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=domrock
DB_USER=postgres
DB_PASSWORD=postgres
```

### Running the Server
```bash
cd src
python -m uvicorn main:app --reload
```

---

## 📚 Interactive Documentation
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

---

## 🎯 Frontend Implementation Suggestions

### Authentication Flow
1. User submits login form → POST `/login`
2. Store JWT token in localStorage/sessionStorage
3. Include token in Authorization header for protected routes
4. Handle token expiration and refresh

### Data Management
- Implement pagination for `/vendas` and `/estoque` endpoints
- Add search/filter functionality on frontend side
- Use charts/graphs to visualize sales and inventory data

### File Upload
- Implement drag & drop for CSV files
- Show upload progress
- Validate file format before upload
- Display success/error messages

### User Management
- Registration form → POST `/usuario`
- User profile page → GET/PUT `/usuario/{id}`
- Account deletion → DELETE `/usuario/{id}`

### Reporting
- Email report form → POST `/relatorios/enviar`
- Allow users to customize email subject and body
- Show confirmation after sending reports