# API\_6-Semestre — Frontend Web

## Resumo 

Sistema web do projeto **Banana Script** — transforma CSVs de vendas/estoque em dados centralizados, disponibiliza consultas em linguagem natural via chat (LLM) e gera resumos executivos automáticos. Interface responsiva para web e mobile; integração com backend em SQL e deploy planejado em AWS. Desenvolvido por estudantes da FATEC (6º semestre).

## Como rodar

Pré-requisitos: Node.js e npm (recomendado usar nvm).

```sh
# 1. clonar
git clone https://github.com/BananaScripts/API_6-Semester-Frontend.git
cd API_6-Semester-Frontend

# 2. instalar dependências
npm install

# 3. rodar em desenvolvimento (hot-reload)
npm run dev
```

Nota rápida: configure variáveis de ambiente (ex.: endpoint do backend / chaves de LLM) conforme `.env.example` antes de rodar se necessário.

## Tecnologias

* Vite
* TypeScript
* React
* Tailwind CSS
* shadcn-ui


