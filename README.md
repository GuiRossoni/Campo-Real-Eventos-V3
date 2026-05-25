Campo Real Eventos - React + Express (Frontend / Backend)
===============================================

Projeto de eventos da instituição Campo Real com frontend em React + Vite (TypeScript) e backend em Node.js + Express.

📋 Estrutura do Projeto
-----------------------
frontend/
- frontend/src/           # Código fonte do app React (TypeScript, componentes, estilos)
- frontend/vite.config.ts # Configuração do Vite
backend/
- backend/src/            # API Express, rotas e configuração do banco local/MySQL
- backend/src/config      # Configurações (env, database)
dist/                     # Artefatos de produção do frontend (gerado por `npm run build`)

🚀 Como Executar
----------------
Instalação de Dependências
```
npm install
```

Desenvolvimento (frontend + backend em único processo)
```
npm run dev
```
Observações: o script `dev` define `HMR_PORT`, `PORT=3001` e `NODE_ENV=development` e inicia o backend. Em modo `development` o servidor inicializa o middleware do Vite para servir o frontend com HMR.

Apenas backend (rodar API sem HMR)
```
$env:NODE_ENV='production'
$env:PORT='3000'
node backend/src/server.js
```

Build para Produção (gera `dist/` do frontend)
```
npm run build
```

📦 Tecnologias Utilizadas
-------------------------
- TypeScript (frontend) - Linguagem tipada para qualidade de código
- Vite + React - Frontend moderno com HMR
- Node.js + Express - API REST para backend
- MySQL (opcional) ou JSON local de fallback - Persistência
- HTML/CSS - Marcação e estilos

🔌 Endpoints principais (resumo)
-------------------------------
Observação: o backend está organizado em módulos em `backend/src/modules`. Seguem os endpoints mais usados:

- GET  /api/db/get-state               -> retorna o estado completo (users, events, workshops, enrollments, attendance, banners, logs, certificates)
- POST /api/db/write-user-register     -> registra usuário (auth)
- POST /api/db/write-user-update       -> atualiza usuário
- POST /api/db/write-event-save        -> cria evento
- POST /api/db/write-event-update      -> atualiza evento
- POST /api/db/write-event-delete      -> remove evento
- POST /api/db/write-workshop-save     -> cria workshop
- POST /api/db/write-enrollment-save   -> registra inscrição
- POST /api/db/write-certificate-save  -> grava certificado
- POST /api/db/write-log               -> grava log do sistema

📝 Notas
--------
- A persistência padrão é um arquivo `local_db_fallback.json` quando as variáveis de conexão MySQL não estiverem configuradas.
- Use o `.env` local para fornecer as credenciais (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Não versionar: `.gitignore` já ignora `.env*`.
- Para ajustar HMR se houver conflito de porta, defina `HMR_PORT` no `.env` ou no comando de execução.

👥 Autores / Contribuidores
-------------------------
- Anne Gabrielly Latchuk
- Guilherme Rossoni
