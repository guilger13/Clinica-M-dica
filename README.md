# 🏥 Clínica Médica

Sistema web desenvolvido para gerenciamento básico de usuários de uma Clínica Médica, permitindo cadastro, autenticação e acesso a uma área restrita (Dashboard).

## 📋 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de aplicar conceitos de desenvolvimento Front-End e integração com banco de dados, utilizando autenticação de usuários e manipulação de informações em tempo real.

O sistema permite que novos usuários realizem cadastro, façam login e acessem uma área protegida após autenticação.

---

## 🚀 Funcionalidades

### 👤 Cadastro de Usuários
- Cadastro com nome, e-mail e senha.
- Validação dos campos obrigatórios.
- Mensagens de sucesso e erro.
- Armazenamento dos dados no banco de dados.

### 🔐 Login
- Autenticação de usuários cadastrados.
- Verificação de credenciais.
- Redirecionamento para Dashboard após login.

### 📊 Dashboard
- Área restrita para usuários autenticados.
- Exibição de informações do usuário.
- Controle de sessão.

### 🎨 Interface
- Design responsivo.
- Feedback visual para ações do usuário.
- Animações de sucesso e erro.

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6)
- Firebase Authentication
- Firebase Firestore
- GitHub

---

## 📂 Estrutura do Projeto

```bash
Clinica-Medica/
│
├── index.html          # Página principal (Login/Cadastro)
├── dashboard.html      # Área restrita do sistema
├── app.js              # Lógica da aplicação
├── config.js           # Configuração do Firebase
└── README.md           # Documentação do projeto
```

---

## ⚙️ Configuração do Firebase

No arquivo `config.js`, configure as credenciais do seu projeto Firebase:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX"
};
```

---

## ▶️ Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Clinica-Medica.git
```

### 2. Entrar na Pasta

```bash
cd Clinica-Medica
```

### 3. Configurar o Firebase

Crie um projeto no Firebase e adicione as credenciais no arquivo `config.js`.

### 4. Executar

Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server do VS Code.

---

## 🔒 Regras de Segurança

- Apenas usuários autenticados podem acessar o Dashboard.
- Senhas são gerenciadas pelo Firebase Authentication.
- Proteção contra acesso direto à área restrita sem login.

---

## 🎯 Objetivos de Aprendizagem

Este projeto foi desenvolvido para praticar:

- Estruturação de aplicações Web.
- Manipulação do DOM.
- Autenticação de usuários.
- Integração com Firebase.
- CRUD básico.
- Organização de código JavaScript.

---

## 👨‍💻 Autor

Desenvolvido por Gabriel e Cauã para fins acadêmicos.

---

## 📄 Licença

Este projeto é destinado exclusivamente para fins educacionais e acadêmicos.
