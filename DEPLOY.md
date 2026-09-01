# 🚀 Deployment Guide (Free Tier)

Deploy the Employee Activity Monitoring System using **Vercel** (frontend) + **Render** (backend + face recognition) + **MongoDB Atlas** (database).

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Vercel     │────▶│  Render (Node.js) │────▶│  MongoDB Atlas   │
│  (React UI)  │     │   Backend API     │     │   (Database)     │
└──────────────┘     └──────────────────┘     └──────────────────┘
                            │
                            ▼
                     ┌──────────────────┐
                     │  Render (Python)  │
                     │  Face Recognition │
                     └──────────────────┘
```

---

## Step 1: MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account → Create a free cluster (M0 Sandbox)
3. **Database Access** → Add a new user (username + password)
4. **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Render)
5. **Deployment** → Connect → **Connect your application**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your DB user credentials

---

## Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. **New** → **Web Service**
3. Connect your GitHub repo → Select the repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Name** | `employee-monitoring-api` |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node app.js` |
   | **Plan** | Free |
5. **Add Environment Variable:**
   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `NODE_ENV` | `production` |
6. Click **Create Web Service**
7. Wait for deployment → Copy the URL (e.g., `https://employee-monitoring-api.onrender.com`)

---

## Step 3: Deploy Face Recognition Service (Render)

1. **New** → **Web Service** → Connect same repo
2. Configure:
   | Setting | Value |
   |---------|-------|
   | **Name** | `face-recognition-api` |
   | **Root Directory** | `face_recognition` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT` |
   | **Plan** | Free |
3. Click **Create Web Service**
4. Wait for deployment → Copy the URL (e.g., `https://face-recognition-api.onrender.com`)

---

## Step 4: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import your GitHub repo
3. Configure:
   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
4. **Add Environment Variable:**
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Your Render backend URL (e.g., `https://employee-monitoring-api.onrender.com`) |
5. Click **Deploy**
6. Done! Your app is live at `https://your-project.vercel.app`

---

## Step 5: Update Face Recognition API URL (Optional)

If you want face recognition to work, update the frontend to call the Python service:

1. Add another env var in Vercel:
   | Key | Value |
   |-----|-------|
   | `VITE_FACE_API_URL` | Your Render Python URL (e.g., `https://face-recognition-api.onrender.com`) |
2. Or hardcode it in the attendance page to call the Python service directly

---

## Environment Variables Summary

### Vercel (Frontend)
| Variable | Example Value |
|----------|---------------|
| `VITE_API_URL` | `https://employee-monitoring-api.onrender.com` |

### Render (Backend)
| Variable | Example Value |
|----------|---------------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `NODE_ENV` | `production` |

### Render (Face Recognition)
| Variable | Example Value |
|----------|---------------|
| `PYTHON_VERSION` | `3.11` |

---

## ⚠️ Important Notes

1. **Free tier spin-down**: Render free tier services spin down after 15 min of inactivity. First request after idle takes ~30-60s to wake up.
2. **CORS**: The backend already has `cors()` enabled — it will accept requests from any origin.
3. **Data**: MongoDB Atlas free tier gives 512 MB storage — enough for thousands of employees.
4. **Face Recognition**: The Python service may take 30-60s to wake up on first request (free tier).
5. **Fallback Store**: When MongoDB is down, the backend uses in-memory storage (data lost on restart). For production, ensure MongoDB Atlas is properly configured.

---

## Quick Commands

```bash
# Test backend health
curl https://employee-monitoring-api.onrender.com/ping

# Test face recognition
curl https://face-recognition-api.onrender.com/ping

# Local development
cd backend && npm install && node app.js
cd client && npm install && npm run dev
```
