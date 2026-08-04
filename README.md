# Wordloom frontend

React + TypeScript frontend for the Language Flashcards API.

## Pages

- **Sign in:** select one of the usernames returned by the backend
- **Add a word:** choose a language, enter a word and optional English meaning, then write or AI-generate a sentence
- **Reviews:** see due words, their sentences, and complete each review

The app checks the backend for due reminders every minute. If the learner enables browser notifications, new due reminders appear as system notifications while the app is open. Delivery while every tab is closed requires Web Push and is outside this MVP.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8000/api` by default.

## Docker

Vite variables are compiled into the static build, so set the public API URL while building:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com/api \
  -t language-flashcards-frontend .

docker run --rm -p 8080:80 language-flashcards-frontend
```

Open `http://localhost:8080`.

## Checks

```bash
npm test
npm run build
```

## Jenkins

The root `Jenkinsfile` uses the Jenkins agent's system `docker` command. It runs npm tests and the production build with `docker run node:22-alpine`, then builds the image with `docker build`. Set the `VITE_API_URL` Jenkins parameter to the public backend URL. The Jenkins agent needs Docker CLI access and permission to use the Docker daemon.
