# SEREN - Mental Health & Therapy Platform

This repository contains the full-stack Mental Health & Therapy application, featuring a React + Vite frontend and a Node.js/Express + MongoDB backend.

## 🚀 Architecture
- **Frontend:** React, TypeScript/JavaScript, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express 5.x, MongoDB (Mongoose), Socket.io
- **Security:** Helmet, HPP, Rate Limiting, Custom Payload Sanitization, CORS validation.

---

## 🌍 Deployment Guide (Free Tier)

This application is configured for a split deployment. The Frontend is optimized for **Vercel** and the Backend is optimized for **Render**.

### 1. Server Deployment (Render)
1. Push this repository to GitHub.
2. Sign in to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your repository and configure:
   - **Root Directory:** \server\
   - **Environment:** \Node\
   - **Build Command:** \
pm install\
   - **Start Command:** \
ode server.js\
4. Expand **Environment Variables** and add the keys listed in \server/.env.example\.
5. Deploy and copy your new backend URL (e.g., \https://seren-api.onrender.com\).

### 2. Client Deployment (Vercel)
1. Sign in to [Vercel.com](https://vercel.com) and **Add New Project**.
2. Connect your repository and configure:
   - **Framework Preset:** \Vite\
   - **Root Directory:** \client\ (Click edit to change it)
   - **Build Command:** \
pm run build\
   - **Output Directory:** \dist\
3. Expand **Environment Variables** and add:
   - \VITE_API_URL\: *Your Render backend URL from Step 1.*
4. Deploy and copy your new frontend URL (e.g., \https://seren-app.vercel.app\).

### 3. Connect the Two (CORS Security)
1. Go back to your Render **Web Service**.
2. Add one final Environment Variable:
   - \CLIENT_URL\: *Your Vercel frontend URL from Step 2.*
3. Restart the Render server to apply the new strict CORS security!

---

## 🛠 Local Development

If you want to run this application locally, you will need two terminals.

**1. Start the Backend:**
\\\ash
cd server
npm install
npm run dev
\\\

**2. Start the Frontend:**
\\\ash
cd client
npm install
npm run dev
\\\
*(Ensure you have your \.env\ files created from the \.env.example\ templates before starting).*
