# Fullstack Authentication API

Uma API de autenticação completa desenvolvida com Node.js, TypeScript, Express e MongoDB, utilizando JWT para autenticação.

## 🚀 Funcionalidades

- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Rotas protegidas
- ✅ Hash de senhas com bcrypt
- ✅ Validação de dados
- ✅ Tratamento de erros robusto
- ✅ Logs detalhados
- ✅ Configuração de ambiente
- ✅ Docker support

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- MongoDB (local ou Atlas)
- Docker (opcional)

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp env.template .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/userauth
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-must-be-at-least-32-characters
   NODE_ENV=development
   ```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up
```

## 📚 API Endpoints

### Rotas Públicas

#### POST /api/register
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "id": "user_id",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "message": "Usuário criado com sucesso"
}
```

#### POST /api/login
Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Login realizado com sucesso"
}
```

### Rotas Protegidas

#### GET /api/protected
Rota protegida que requer token JWT válido.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Resposta (200):**
```json
{
  "message": "Acesso autorizado!",
  "user": {
    "id": "user_id",
    "email": "joao@example.com"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/profile
Retorna informações do perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🧪 Testes

Use os scripts de teste fornecidos na pasta `request/`:

```bash
# Teste de registro
chmod +x request/register_success.sh
./request/register_success.sh

# Teste de login
chmod +x request/login_sucess.sh
./request/login_sucess.sh

# Teste de rota protegida
chmod +x request/protected_valid.sh
./request/protected_valid.sh
```

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações
├── controllers/     # Controladores
├── database/        # Conexão com banco
├── middlewares/     # Middlewares
├── models/          # Modelos de dados
├── routes/          # Rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários
├── app.ts           # Configuração do Express
└── server.ts        # Servidor principal
```

## 🔒 Segurança

- Senhas são hashadas com bcrypt
- Tokens JWT com expiração
- Validação de entrada
- CORS configurado
- Headers de segurança
- Logs de segurança

## 📝 Logs

O sistema inclui logs detalhados para:
- Requisições HTTP
- Erros de autenticação
- Conexões com banco
- Operações de usuário

## 🐳 Docker

O projeto inclui configuração Docker completa:

```bash
# Build e execução
docker-compose up --build

# Apenas execução
docker-compose up
```

## 🚨 Códigos de Erro

- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Token inválido
- `404` - Rota não encontrada
- `409` - Email já cadastrado
- `500` - Erro interno do servidor

## 📄 Licença

ISC
