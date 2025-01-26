import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {FRONT_URL, HTTP_PORT} from './utils/config.js';
import { testPgConnection } from './utils/database.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import logsRoutes from './routes/logsRoutes.js';
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();


app.use(cors({
    origin: FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use(userRoutes);
app.use('/admin', adminRoutes);
app.use('/vehicle', vehicleRoutes);
app.use(logsRoutes);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'no such page' });
});

app.use((err, req, res, next) => {
    console.error(err.stack, typeof next);
    res.status(500).send('Something went wrong!');
});


async function main() {
    await testPgConnection();

    app.listen(HTTP_PORT, () => {
        console.log(`Server is running on http://localhost:${HTTP_PORT}`);
    });
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
