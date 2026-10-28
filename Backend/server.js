require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        for (const key of ["JWT_SECRET", "GOOGLE_GENAI_API_KEY"]) {
            if (!process.env[key]?.trim()) {
                throw new Error(`${key} is missing. Configure Backend/.env before starting the API.`);
            }
        }

        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Backend startup failed:', error.message);
        process.exitCode = 1;
    }
}

startServer();