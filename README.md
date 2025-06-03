# DGTL P2E Game

## Требования
- Node.js v18 или выше
- MongoDB
- ngrok

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/IvanZhutyaev/dgtl-miniapp.git
cd dgtl-miniapp
```

2. Установите зависимости для всех компонентов:
```bash
npm run install:all
```

## Настройка

1. Создайте файл `.env.local` в директории `client/`:
```
MONGODB_URI=mongodb://localhost:27017/dgtl_miniapp
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
TELEGRAM_BOT_TOKEN=your_bot_token
SERVER_URL=http://localhost:3001
```

2. Создайте файл `.env` в директории `bot/`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
WEB_APP_URL=your_ngrok_url
SERVER_URL=http://localhost:3001
```

## Запуск

1. В первом терминале запустите ngrok:
```bash
npm run tunnel
```
Скопируйте полученный URL (например, https://xxx-xx-xx-xxx-xxx.ngrok-free.app)

2. Обновите URL в конфигурационных файлах:
- В `bot/.env` обновите `WEB_APP_URL`
- В `client/.env.local` обновите `NEXTAUTH_URL`

3. В другом терминале запустите приложение:
```bash
npm run dev
```

Это запустит:
- Next.js клиент на порту 3000
- Express сервер на порту 3001
- Telegram бота

## Структура проекта

- `/client` - Next.js фронтенд
- `/server` - Express.js бэкенд
- `/bot` - Telegram бот