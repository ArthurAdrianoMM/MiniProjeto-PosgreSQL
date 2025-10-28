# Fullstack Authentication API

Uma API de autenticação completa desenvolvida com Node.js, TypeScript, Express e MongoDB, utilizando JWT para autenticação.

## 🚀 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Rotas protegidas
- ✅ Hash de senhas com bcrypt

### Controle de Hábitos (CRUD Completo)
- ✅ Criação de hábitos (POST)
- ✅ Listagem de hábitos com filtros (GET)
- ✅ Busca de hábito específico (GET by ID)
- ✅ Atualização completa (PUT)
- ✅ Atualização parcial (PATCH)
- ✅ Exclusão de hábitos (DELETE)
- ✅ Isolamento de dados por usuário
- ✅ Validação completa de dados

### Infraestrutura
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

## 🎯 API de Controle de Hábitos

### Rotas CRUD para Hábitos

Todas as rotas abaixo requerem autenticação JWT no header `Authorization: Bearer <token>`.

#### POST /api/habits
Cria um novo hábito para o usuário autenticado.

**Body:**
```json
{
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal"
}
```

**Resposta (201):**
```json
{
  "id": "habit_id",
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "message": "Hábito criado com sucesso"
}
```

#### GET /api/habits
Lista todos os hábitos do usuário autenticado, com suporte a filtros opcionais.

**Query Parameters:**
- `isActive` - Filtrar por status (true/false)
- `frequency` - Filtrar por frequência
- `name` - Buscar por nome (busca parcial)

**Exemplos:**
- `GET /api/habits`
- `GET /api/habits?isActive=true`
- `GET /api/habits?frequency=Semanal`

#### GET /api/habits/:id
Retorna detalhes de um hábito específico.

#### PUT /api/habits/:id
Atualiza todos os campos de um hábito.

**Body:**
```json
{
  "name": "Academia - Atualizado",
  "description": "Descrição atualizada",
  "frequency": "Semanal",
  "isActive": true
}
```

#### PATCH /api/habits/:id
Atualiza parcialmente um hábito (apenas os campos enviados).

**Body:**
```json
{
  "description": "Nova descrição",
  "isActive": false
}
```

#### DELETE /api/habits/:id
Remove um hábito.

📖 **Documentação completa:** Veja [HABITS_API.md](./HABITS_API.md) para mais detalhes sobre a API de hábitos.

## 🧪 Testes

### Testes de Autenticação
Use os scripts de teste fornecidos na pasta `request/`:

```bash
# Teste de registro
./request/register_success.sh

# Teste de login
./request/login_sucess.sh

# Teste de rota protegida
./request/protected_valid.sh
```

### Testes de Hábitos
```bash
# Criar múltiplos hábitos de exemplo
./request/create_multiple_habits.sh

# Criar um hábito
./request/create_habit.sh

# Listar todos os hábitos
./request/list_habits.sh

# Listar hábitos com filtros
./request/list_habits_filtered.sh

# Buscar hábito específico
./request/get_habit.sh

# Atualizar hábito (PUT)
./request/update_habit.sh

# Atualizar hábito (PATCH)
./request/patch_habit.sh

# Deletar hábito
./request/delete_habit.sh
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
- `401` - Não autorizado (token ausente ou inválido)
- `403` - Acesso proibido (tentativa de acessar recurso de outro usuário)
- `404` - Rota não encontrada ou recurso não existe
- `409` - Email já cadastrado
- `500` - Erro interno do servidor

## 📄 Licença

ISC
