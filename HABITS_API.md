# API de Controle de Hábitos

Esta documentação descreve a API de CRUD completa para controle de hábitos, desenvolvida como parte do Mini-projeto Parte I.v2.

## Visão Geral

O sistema permite que usuários cadastrem e gerenciem seus hábitos pessoais (como academia, meditação, etc.). Todas as rotas são protegidas por autenticação JWT, garantindo que cada usuário só possa acessar seus próprios hábitos.

## Estrutura de Dados

### Habit Model

```typescript
{
  name: string,           // Nome do hábito (obrigatório, 2-100 caracteres)
  description?: string,    // Descrição do hábito (opcional, máx. 500 caracteres)
  frequency: string,      // Frequência: "Diário" | "Semanal" | "Quinzenal" | "Mensal" (obrigatório)
  isActive: boolean,      // Status do hábito (padrão: true)
  userId: ObjectId,       // ID do usuário proprietário (automático)
  createdAt: Date,        // Data de criação (automático)
  updatedAt: Date        // Data de última atualização (automático)
}
```

## Rotas

**Base URL**: `http://localhost:3000/api/habits`

### 1. POST /api/habits - Criar Hábito

Cria um novo hábito para o usuário autenticado.

**Autenticação**: Requerida (Bearer Token)

**Request Body**:
```json
{
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true
}
```

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "message": "Hábito criado com sucesso"
}
```

**Erros**:
- `400` - Dados inválidos
- `401` - Não autenticado

---

### 2. GET /api/habits - Listar Hábitos

Retorna todos os hábitos do usuário autenticado, com suporte a filtros opcionais.

**Autenticação**: Requerida (Bearer Token)

**Query Parameters**:
- `isActive` (boolean) - Filtrar por status ativo/inativo
- `frequency` (string) - Filtrar por frequência
- `name` (string) - Filtrar por nome (busca parcial, case-insensitive)

**Exemplos**:
- `GET /api/habits`
- `GET /api/habits?isActive=true`
- `GET /api/habits?frequency=Semanal`
- `GET /api/habits?name=Academia`

**Response** (200 OK):
```json
{
  "habits": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Academia",
      "description": "Treino de musculação 3x por semana",
      "frequency": "Semanal",
      "isActive": true,
      "userId": "507f191e810c19729de860ea",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1,
  "message": "Hábitos listados com sucesso"
}
```

**Erros**:
- `401` - Não autenticado

---

### 3. GET /api/habits/:id - Buscar Hábito Específico

Retorna detalhes de um hábito específico.

**Autenticação**: Requerida (Bearer Token)

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Treino de musculação 3x por semana",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Erros**:
- `401` - Não autenticado
- `403` - Hábito não pertence ao usuário
- `404` - Hábito não encontrado

---

### 4. PUT /api/habits/:id - Atualizar Hábito (Completo)

Atualiza todos os campos de um hábito.

**Autenticação**: Requerida (Bearer Token)

**Request Body**:
```json
{
  "name": "Academia - Atualizado",
  "description": "Treino de musculação atualizado",
  "frequency": "Semanal",
  "isActive": true
}
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia - Atualizado",
  "description": "Treino de musculação atualizado",
  "frequency": "Semanal",
  "isActive": true,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z",
  "message": "Hábito atualizado com sucesso"
}
```

**Erros**:
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Hábito não pertence ao usuário
- `404` - Hábito não encontrado

---

### 5. PATCH /api/habits/:id - Atualizar Hábito (Parcial)

Atualiza parcialmente os campos de um hábito.

**Autenticação**: Requerida (Bearer Token)

**Request Body** (apenas os campos que deseja atualizar):
```json
{
  "description": "Descrição atualizada",
  "isActive": false
}
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Academia",
  "description": "Descrição atualizada",
  "frequency": "Semanal",
  "isActive": false,
  "userId": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z",
  "message": "Hábito atualizado com sucesso"
}
```

**Erros**:
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Hábito não pertence ao usuário
- `404` - Hábito não encontrado

---

### 6. DELETE /api/habits/:id - Deletar Hábito

Remove um hábito.

**Autenticação**: Requerida (Bearer Token)

**Response** (200 OK):
```json
{
  "message": "Hábito deletado com sucesso",
  "id": "507f1f77bcf86cd799439011"
}
```

**Erros**:
- `401` - Não autenticado
- `403` - Hábito não pertence ao usuário
- `404` - Hábito não encontrado

---

## Autenticação

Todas as rotas de hábitos requerem autenticação JWT. O token deve ser enviado no header `Authorization`:

```
Authorization: Bearer <token>
```

Para obter um token, utilize as rotas de autenticação:
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Fazer login

## Segurança

- ✅ Usuários só podem acessar seus próprios hábitos
- ✅ Tentativas de acessar hábitos de outros usuários retornam `403 Forbidden`
- ✅ Todas as rotas são protegidas por JWT
- ✅ Validação de entrada em todos os endpoints
- ✅ Logs apropriados para auditoria

## Exemplos de Uso

### Usando cURL

**1. Criar hábito**:
```bash
curl -X POST http://localhost:3000/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meditação",
    "description": "Praticar meditação diariamente",
    "frequency": "Diário"
  }'
```

**2. Listar hábitos**:
```bash
curl -X GET http://localhost:3000/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Buscar hábito específico**:
```bash
curl -X GET http://localhost:3000/api/habits/HABIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Atualizar hábito (PUT)**:
```bash
curl -X PUT http://localhost:3000/api/habits/HABIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meditação - Atualizado",
    "description": "Praticar meditação diariamente pela manhã",
    "frequency": "Diário",
    "isActive": true
  }'
```

**5. Atualizar hábito (PATCH)**:
```bash
curl -X PATCH http://localhost:3000/api/habits/HABIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

**6. Deletar hábito**:
```bash
curl -X DELETE http://localhost:3000/api/habits/HABIT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Usando os Scripts de Teste

Scripts de teste estão disponíveis na pasta `request/`:
- `create_habit.sh` - Criar um hábito
- `list_habits.sh` - Listar todos os hábitos
- `list_habits_filtered.sh` - Listar hábitos com filtros
- `get_habit.sh` - Buscar hábito específico
- `update_habit.sh` - Atualizar hábito (PUT)
- `patch_habit.sh` - Atualizar hábito (PATCH)
- `delete_habit.sh` - Deletar hábito

Para usar os scripts:
```bash
./request/create_habit.sh
./request/list_habits.sh
```

## Validações

### Nome
- Obrigatório
- Mínimo 2 caracteres
- Máximo 100 caracteres

### Descrição
- Opcional
- Máximo 500 caracteres

### Frequência
- Obrigatória
- Valores aceitos: "Diário", "Semanal", "Quinzenal", "Mensal"

### isActive
- Boolean
- Padrão: `true`

## Arquitetura

A funcionalidade segue a estrutura de camadas estabelecida:

- **models/** - Definição do schema do Mongoose
- **services/** - Lógica de negócio e acesso aos dados
- **controllers/** - Manipulação de requisições HTTP
- **routes/** - Definição de rotas e middlewares
- **middlewares/** - Autenticação JWT

## Logs

O sistema registra logs apropriados para:
- Criação de hábitos
- Atualizações de hábitos
- Exclusões de hábitos
- Tentativas de acesso não autorizado
- Erros e validações

