# AdSnap AI — adsnap-ai.eu

AI платформа за генериране на реклами, фотосесии и viral YouTube thumbnails.

## 🚀 Деплой на Vercel

1. Качи в **GitHub** repo
2. **vercel.com** → New Project → Environment Variables:
   - `KIE_API_KEY` = твоят ключ от kie.ai
3. **Deploy** → свържи домейна `adsnap-ai.eu`

## 📁 Структура

```
adsnap-ai/
├── api/
│   ├── generate.js   ← Прокси към Kie.ai
│   ├── status.js     ← Проверка на статус
│   └── youtube.js    ← Извличане на YouTube video info
├── public/
│   └── index.html    ← Цялото приложение
├── vercel.json
└── package.json
```

## ✨ Функции

### 🎨 Банери & Реклами
6 готови формата (Facebook, Instagram, YouTube, LinkedIn, Web)

### 📸 Професионални Фотосесии
6 типа (Портрет, Продукт, Fashion, Храна, Интериор, Lifestyle)

### ▶️ YouTube Viral Thumbnails (НОВО!)
1. Потребителят поставя YouTube линк
2. AI анализира видеото (заглавие, автор)
3. Избира стил (Viral/Clean/Emotional/Bold)
4. Генерира scroll-stopping thumbnail в 16:9

## 🔒 Сигурност
- API ключът е скрит в Vercel Environment Variables
- Клиентите ползват кредитна система

## 💳 Кредити
- Нови: 3 безплатни
- 1K=1, 2K=2, 4K=5 кредита
- За плащания: интегрирай Stripe

## 🌐 Домейн
Свържи `adsnap-ai.eu` от Vercel Dashboard → Domains
