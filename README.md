# DGTL P2E Game

**DGTL P2E Game** — это Play-to-Earn (P2E) мини-игра с интеграцией Telegram, где пользователи собирают минералы, проходят уровни, используют бусты и зарабатывают внутриигровую валюту. Проект состоит из трёх основных частей: Next.js фронтенд, Express.js сервер и Telegram-бот.

---

## Ключевые особенности

- **P2E механика**: сбор минералов, очки, уровни, бусты, внутриигровая валюта
- **Telegram WebApp**: авторизация и запуск игры прямо из Telegram
- **MongoDB**: хранение данных о пользователях, уровнях, минералах
- **Механика уровней**: уникальные наборы минералов, оформление, скорость, длительность
- **Бусты**: временные усиления, влияющие на игровой процесс
- **REST API**: отдельные эндпоинты для пользователей, минералов, уровней
- **ngrok**: проброс локального сервера для интеграции с Telegram

---

## Структура проекта

- `/client` — Next.js фронтенд (игра, WebApp, авторизация, UI)
- `/server` — Express.js API (пользователи, уровни, минералы, прогресс)
- `/bot` — Telegram-бот (регистрация, запуск WebApp, синхронизация)
- `/mongodb-connection-test` — тесты и примеры для подключения к MongoDB (необязательно для продакшена)

---

## Требования
- Node.js v18 или выше
- MongoDB
- ngrok

---

## Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/IvanZhutyaev/dgtl-miniapp.git
cd dgtl-miniapp
npm run install:all
```

### 2. Настройка переменных окружения

- В `client/.env.local`:
  ```
  MONGODB_URI=mongodb://localhost:27017/dgtl_miniapp
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your_secret_key
  TELEGRAM_BOT_TOKEN=your_bot_token
  SERVER_URL=http://localhost:3001
  ```
- В `bot/.env`:
  ```
  TELEGRAM_BOT_TOKEN=your_bot_token
  WEB_APP_URL=your_ngrok_url
  SERVER_URL=http://localhost:3001
  ```

### 3. Запуск

1. Откройте первый терминал и запустите ngrok:
   ```bash
   npm run tunnel
   ```
   Скопируйте выданный публичный URL (например, https://xxx-xx-xx-xxx-xxx.ngrok-free.app).

2. Обновите переменные окружения:
   - В `bot/.env` — `WEB_APP_URL`
   - В `client/.env.local` — `NEXTAUTH_URL`

3. Во втором терминале запустите все сервисы:
   ```bash
   npm run dev
   ```
   Это запустит:
   - Next.js клиент на порту 3000
   - Express сервер на порту 3001
   - Telegram-бота

---

## Основные команды

- `npm run dev` — запуск всех сервисов (клиент, сервер, бот)
- `npm run tunnel` — запуск ngrok для проброса WebApp
- `npm run install:all` — установка зависимостей во всех пакетах

---

## Краткое описание API

- `POST /api/users/sync` — синхронизация пользователя из Telegram
- `GET /api/users/:telegramId` — получить пользователя по Telegram ID
- `GET /api/levels` — получить список уровней
- `POST /api/levels/check-next/:currentLevel` — проверить, открыт ли следующий уровень
- `POST /api/minerals/collect` — добавить собранный минерал
- `GET /api/minerals/user/:userId` — получить минералы пользователя

---

## Лицензия

Проект распространяется под лицензией MIT.