# Resume Studio

Resume Studio is a React app with an Express API, MongoDB persistence, and AI-generated resume-to-role feedback.

## Requirements

- Node.js and npm
- A MongoDB connection string
- A Google GenAI API key

## Configure the backend

Create `Backend/.env` using `Backend/.env.example` as a template and fill in your own values. Keep the real `.env` file private; never commit API keys, database credentials, or JWT secrets.

If `MONGO_URI` is missing or left as a placeholder, the app automatically falls back to a local MongoDB instance at `mongodb://127.0.0.1:27017/resume-builder` so development can continue without a remote Atlas connection. For production or shared environments, replace it with a valid MongoDB connection string.

## Run locally on Windows

Double-click `start-dev.cmd` from the project folder. It opens separate terminal windows for the API and frontend. Keep both windows open while using the app.

Or start each service in its own terminal:

```powershell
cd Backend
npm run dev
```

```powershell
cd Fronted
npm run dev
```

Open <http://127.0.0.1:5173>. The backend waits for MongoDB before accepting requests. Check its readiness at <http://127.0.0.1:3000/api/health>; a healthy response reports both the API and database status.
