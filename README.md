# A3 de Gestão e Qualidade de Software

Repositório com os códigos legado e refatorados utilizados para desenvolver a proposta de projeto de A3 da UC de Gestão e Qualidade de Software - Semestre 01/2025.

**Professores:**  
Arquelau Pasta  
Henrique Ruiz Poyatos Neto
Magda Miyashiro

**Grupo:**

| Nome  | RA |
| -------------  | --- |
| Antonio Carlos R. Oliveira Russo | ** |
| Victor Henique Chaves De Jesus| RA 822222873|
| Lucas Almeida Braz| RA 1272322938|
| Igor Henrque Andrade Martins| RA 323210810|

**Como rodar o projeto:**

1. Clone o repositório
2. Acesse a pasta do projeto com `cd RefactoredCode` ou `cd LegacyCode`
3. Instale as dependências com `npm install`
4. Execute o servidor com `npm run dev`
5. Acesse a API no endereço `http://localhost:3000`

# Documentação da API de Gerenciamento de Pacientes

**Documentação da API e testes:**

A coleção do postman para testes pode ser encontrada no arquivo `A3 Poyatos.postman_collection.json`.

## 1. Overview

Esta API permite o gerenciamento de pacientes e usuários. Oferece funcionalidades para registrar, autenticar e gerenciar usuários, bem como cadastrar, listar, editar e ativar/inativar (soft delete) pacientes. A API utiliza autenticação baseada em token JWT para proteger os endpoints de pacientes.

## 2. Authentication

A autenticação é realizada através de um Bearer Token JWT. Primeiro, obtenha um token fazendo uma requisição para o endpoint de login. Em seguida, inclua este token no cabeçalho `Authorization` de todas as requisições para endpoints protegidos. (Para o postman, adicione o conteúdo na variável `token`)

**Exemplo de obtenção de token (Login):**

**cURL:**

```bash
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "seu_email@example.com",
  "password": "sua_senha"
}'
```

**TypeScript (usando Axios):**

```typescript
import axios from 'axios';

async function loginUser() {
  const url = "http://localhost:3000/users/login";
  const payload = {
    email: "seu_email@example.com",
    password: "sua_senha"
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.status);
    console.log(response.data);

    // O token estará em response.data.token
    // Exemplo: const token = response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro ao fazer login:', error.response.status, error.response.data);
    } else {
      console.error('Erro ao fazer login:', error);
    }
  }
}

loginUser();
```

**Utilizando o token em requisições subsequentes:**

**cURL:**

```bash
curl -X GET http://localhost:3000/patients \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

**TypeScript (usando Axios):**

```typescript
import axios from 'axios';

async function getPatients(token: string) {
  const url = "http://localhost:3000/patients";

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(response.status);
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro ao buscar pacientes:', error.response.status, error.response.data);
    } else {
      console.error('Erro ao buscar pacientes:', error);
    }
  }
}

// Supondo que você já obteve o token
const authToken = "SEU_TOKEN_JWT_AQUI"; // Substitua pelo token obtido no login
getPatients(authToken);
```

## 3. Endpoints

### 3.1. Health Check

*   **Endpoint:** `GET /health`
*   **Descrição:** Verifica o status da aplicação.
*   **Autenticação:** Não requerida.
*   **Request Body:** Nenhum.
*   **Response de Sucesso (200 OK):**

    ```json
    {
        "status": "OK",
        "timestamp": "2024-06-05T18:30:00.123Z" // Exemplo de timestamp
    }
    ```

### 3.2. Usuários

#### 3.2.1. Registrar Usuário

*   **Endpoint:** `POST /users`
*   **Descrição:** Registra um novo usuário no sistema.
*   **Autenticação:** Não requerida.
*   **Request Body:**

    ```json
    {
        "name": "Nome Completo do Usuário",
        "email": "usuario@example.com",
        "password": "senhaMinima8caracteres"
    }
    ```
*   **Response de Sucesso (201 Created):**

    ```json
    {
        "id": 1,
        "name": "Nome Completo do Usuário",
        "email": "usuario@example.com"
    }
    ```
*   **Responses de Erro:**
    *   `400 Bad Request`: Se os dados fornecidos forem inválidos (e.g., formato de senha incorreto). A mensagem de erro específica será retornada no corpo da resposta.
        ```json
        "A senha deve ter no mínimo 8 caracteres."
        ```
    *   `409 Conflict`: Se o e-mail fornecido já estiver cadastrado.
        ```json
        "O e-mail informado já está cadastrado."
        ```

#### 3.2.2. Login de Usuário

*   **Endpoint:** `POST /users/login`
*   **Descrição:** Autentica um usuário e retorna um token JWT.
*   **Autenticação:** Não requerida.
*   **Request Body:**

    ```json
    {
        "email": "usuario@example.com",
        "password": "senhaMinima8caracteres"
    }
    ```
*   **Response de Sucesso (200 OK):**

    ```json
    {
        "msg": "Bem vindo, Nome Completo do Usuário!",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: "E-mail ou senha inválidos."
    *   `500 Internal Server Error`: "Erro durante o login."

### 3.3. Pacientes

**Autenticação:** Todos os endpoints de pacientes requerem autenticação via Bearer Token JWT.

#### 3.3.1. Listar Pacientes

*   **Endpoint:** `GET /patients`
*   **Descrição:** Retorna uma lista de todos os pacientes cadastrados.
*   **Request Body:** Nenhum.
*   **Response de Sucesso (200 OK):**

    ```json
    [
        {
            "id": 1,
            "name": "Primeiro Paciente",
            "birthDate": "1990-01-15",
            "cpf": "12345678901",
            "gender": "Masculino",
            "addressLine": "Rua Exemplo, 123",
            "addressNumber": "123",
            "district": "Bairro Modelo",
            "city": "Cidade Exemplo",
            "state": "SP",
            "zipCode": "12345678",
            "active": true
        },
        {
            "id": 2,
            "name": "Segunda Paciente",
            "birthDate": "1985-05-20",
            "cpf": "98765432109",
            "gender": "Feminino",
            "addressLine": "Avenida Teste, 456",
            "addressNumber": "456",
            "district": "Centro",
            "city": "Outra Cidade",
            "state": "RJ",
            "zipCode": "87654321",
            "active": false
        }
    ]
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: Se o token não for fornecido ou for inválido.
    *   `400 Bad Request` ou `500 Internal Server Error`: Em caso de outros erros ao listar pacientes.

#### 3.3.2. Registrar Paciente

*   **Endpoint:** `POST /patients`
*   **Descrição:** Cadastra um novo paciente.
*   **Request Body:**

    ```json
    {
        "name": "Nome do Paciente",
        "birth_date": "2000-12-25", // Formato YYYY-MM-DD
        "gender": "Não informado",
        "cpf": "11122233344",
        "zip_code": "01001000", // Opcional
        "address_number": 100, // Opcional
        "address_line": "Praça da Sé", // Opcional
        "district": "Sé", // Opcional
        "city": "São Paulo", // Opcional
        "state": "SP" // Opcional, 2 caracteres
    }
    ```
*   **Response de Sucesso (201 Created):**

    ```json
    {
        "success": true,
        "message": "Paciente \"Nome do Paciente\" cadastrado com sucesso.",
        "data": {
            "id": 3,
            "name": "Nome do Paciente",
            "birthDate": "2000-12-25",
            "cpf": "11122233344",
            "gender": "Não informado",
            "addressLine": "Praça da Sé",
            "addressNumber": "100",
            "district": "Sé",
            "city": "São Paulo",
            "state": "SP",
            "zipCode": "01001000",
            "active": true
        }
    }
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: Se o token não for fornecido ou for inválido.
    *   `400 Bad Request`: Se os dados fornecidos forem inválidos (e.g., CPF já cadastrado, formato de data incorreto). A mensagem de erro específica será retornada no corpo da resposta.
        ```json
        {
            "error": "O CPF informado já está cadastrado."
        }
        ```

#### 3.3.3. Editar Paciente

*   **Endpoint:** `PUT /patients/:id`
*   **Descrição:** Atualiza os dados de um paciente existente.
*   **Parâmetros de URL:**
    *   `id` (integer, obrigatório): ID do paciente a ser editado.
*   **Request Body:** (Campos opcionais, envie apenas os que deseja alterar. O CPF é obrigatório para edição neste schema.)

    ```json
    {
        "name": "Novo Nome do Paciente",
        "birth_date": "1995-07-10",
        "cpf": "11122233344", // Obrigatório para edição conforme schema
        "gender": "Masculino",
        "zip_code": "02002000"
        // ... outros campos opcionais
    }
    ```
*   **Response de Sucesso (200 OK):**

    ```json
    {
        "success": true,
        "message": "Dados do paciente atualizados com sucesso.",
        "data": {
            "id": 3,
            "name": "Novo Nome do Paciente",
            "birthDate": "1995-07-10",
            "cpf": "11122233344",
            "gender": "Masculino",
            "addressLine": "Praça da Sé", // Mantido se não alterado
            "addressNumber": "100", // Mantido se não alterado
            "district": "Sé", // Mantido se não alterado
            "city": "São Paulo", // Mantido se não alterado
            "state": "SP", // Mantido se não alterado
            "zipCode": "02002000",
            "active": true
        }
    }
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: Se o token não for fornecido ou for inválido.
    *   `400 Bad Request`: Se os dados fornecidos forem inválidos ou o paciente não for encontrado. A mensagem de erro específica será retornada.
    *   `404 Not Found`: Se o paciente com o ID fornecido não existir.
        ```json
        {
            "error": "Paciente não encontrado"
        }
        ```

#### 3.3.4. Inativar Paciente

*   **Endpoint:** `PUT /patients/:id/inactivate`
*   **Descrição:** Inativa um paciente (soft delete).
*   **Parâmetros de URL:**
    *   `id` (integer, obrigatório): ID do paciente a ser inativado.
*   **Request Body:** Nenhum.
*   **Response de Sucesso (200 OK):**

    ```json
    {
        "success": true,
        "message": "Paciente inativado com sucesso."
    }
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: Se o token não for fornecido ou for inválido.
    *   `400 Bad Request` ou `404 Not Found`: Se ocorrer um erro ou o paciente não for encontrado.

#### 3.3.5. Ativar Paciente

*   **Endpoint:** `PUT /patients/:id/activate`
*   **Descrição:** Ativa um paciente previamente inativado.
*   **Parâmetros de URL:**
    *   `id` (integer, obrigatório): ID do paciente a ser ativado.
*   **Request Body:** Nenhum.
*   **Response de Sucesso (200 OK):**

    ```json
    {
        "success": true,
        "message": "Paciente ativado com sucesso."
    }
    ```
*   **Responses de Erro:**
    *   `401 Unauthorized`: Se o token não for fornecido ou for inválido.
    *   `400 Bad Request` ou `404 Not Found`: Se ocorrer um erro ou o paciente não for encontrado.

## 4. Erros Comuns

*   **`401 Unauthorized` - `Faça login para utilizar esse recurso.` / `Token inválido ou expirado.` / `Usuário não autorizado`**
    *   **Causa:** Token JWT não fornecido no cabeçalho `Authorization`, token expirado, token inválido, ou o usuário associado ao token não existe/não tem permissão.
    *   **Solução:** Certifique-se de que um token JWT válido está sendo enviado no cabeçalho `Authorization: Bearer SEU_TOKEN`. Se o token expirou, obtenha um novo através do endpoint `/users/login`.

*   **`400 Bad Request` - Mensagens de validação de schema (e.g., `"O nome deve ser preenchido."`, `"O CPF deve conter 11 dígitos"`)**
    *   **Causa:** Os dados enviados no corpo da requisição não atendem aos critérios de validação definidos para o endpoint (campos obrigatórios faltando, formatos incorretos, etc.).
    *   **Solução:** Verifique a documentação do endpoint específico para garantir que todos os campos obrigatórios estão presentes e que os dados estão no formato correto.

*   **`409 Conflict` - `O e-mail informado já está cadastrado.` (ao registrar usuário)**
    *   **Causa:** Tentativa de registrar um usuário com um e-mail que já existe no sistema.
    *   **Solução:** Utilize um e-mail diferente ou, se for o caso, proceda com o login se o usuário já existir.

*   **`409 Conflict` - `O CPF informado já está cadastrado.` (ao registrar paciente)**
    *   **Causa:** Tentativa de registrar um paciente com um CPF que já existe no sistema.
    *   **Solução:** Verifique se o paciente já não está cadastrado. CPFs devem ser únicos.

*   **`404 Not Found` - `Paciente não encontrado` (ao editar, ativar/inativar paciente)**
    *   **Causa:** O ID do paciente fornecido na URL não corresponde a nenhum paciente cadastrado no sistema.
    *   **Solução:** Verifique se o ID do paciente está correto e se o paciente existe.

## 5. Quick Start (5 minutos para rodar)

Este guia assume que você tem o Node.js e npm (ou yarn) instalados, e que a API está rodando localmente na porta `3000` (conforme configuração padrão em `src/index.ts`).

**1. Clone o Repositório e Instale as Dependências (se aplicável):**

   Se você estiver rodando o projeto localmente a partir do código-fonte:

   ```bash
   # Navegue até o diretório RefactoredCode
   cd caminho/para/A3_GestaoQualidadeSoftware/RefactoredCode

   # Instale as dependências
   npm install
   ```

**2. Configure as Variáveis de Ambiente:**

   Crie um arquivo `.env` na raiz do diretório `RefactoredCode` (baseado no `.env.example`) e configure as variáveis necessárias, especialmente `JWT_PASSWORD` e as credenciais do banco de dados.

   Exemplo de `.env`:

   ```env
   PORT=3000
   JWT_PASSWORD=suaChaveSecretaSuperSeguraParaJWT

   # Configurações do Banco de Dados (PostgreSQL)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seu_usuario_bd
   DB_PASSWORD=sua_senha_bd
   DB_NAME=seu_banco_de_dados
   ```

**3. Inicie a API:**

   No diretório `RefactoredCode`:

   ```bash
   npm run dev
   ```

   Você deverá ver uma mensagem como `Server running on port 3000` no console.

**4. Registre um Novo Usuário (cURL):**

   ```bash
   curl -X POST http://localhost:3000/users \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Usuário Teste",
     "email": "teste@example.com",
     "password": "teste1234"
   }'
   ```

   **Resposta Esperada (201 Created):**

   ```json
   {
       "id": 1, // O ID pode variar
       "name": "Usuário Teste",
       "email": "teste@example.com"
   }
   ```

**5. Faça Login para Obter um Token (cURL):**

   ```bash
   curl -X POST http://localhost:3000/users/login \
   -H "Content-Type: application/json" \
   -d '{
     "email": "teste@example.com",
     "password": "teste1234"
   }'
   ```

   **Resposta Esperada (200 OK):**

   ```json
   {
       "msg": "Bem vindo, Usuário Teste!",
       "token": "SEU_TOKEN_JWT_SERA_EXIBIDO_AQUI"
   }
   ```
   Copie o valor do campo `token`.

**6. Registre um Novo Paciente (cURL, usando o token obtido):**

   Substitua `SEU_TOKEN_JWT_AQUI` pelo token que você copiou.

   ```bash
   curl -X POST http://localhost:3000/patients \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
   -d '{
     "name": "Joana Silva",
     "birth_date": "1988-08-15",
     "gender": "Feminino",
     "cpf": "12312312345"
   }'
   ```

   **Resposta Esperada (201 Created):**

   ```json
   {
       "success": true,
       "message": "Paciente \"Joana Silva\" cadastrado com sucesso.",
       "data": {
           "id": 1, // O ID pode variar
           "name": "Joana Silva",
           "birthDate": "1988-08-15",
           "cpf": "12312312345",
           "gender": "Feminino",
           "addressLine": "",
           "addressNumber": "",
           "district": "",
           "city": "",
           "state": "",
           "zipCode": "",
           "active": true
       }
   }
   ```

Pronto! Você registrou um usuário, obteve um token e cadastrou um paciente na API.
