import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getFullState } from './config/database.js';
import { ENV } from './config/env.js';
import authRouter from './modules/auth/auth.routes.js';
import usersRouter from './modules/users/users.routes.js';
import eventsRouter from './modules/events/events.routes.js';
import enrollmentsRouter from './modules/enrollments/enrollments.routes.js';
import bannersRouter from './modules/banners/banners.routes.js';
import logsRouter from './modules/logs/logs.routes.js';
async function startServer() {
    const app = express();
        const PORT = ENV.PORT || 3000;
    const frontendRoot = path.join(process.cwd(), 'frontend');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.json());
    await initDatabase();
    app.get('/api/db/get-state', async (req, res) => {
        try {
            const state = await getFullState();
            res.json({ success: true, data: state });
        }
        catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    });
    app.use(authRouter);
    app.use(usersRouter);
    app.use(eventsRouter);
    app.use(enrollmentsRouter);
    app.use(bannersRouter);
    app.use(logsRouter);
    if (process.env.NODE_ENV !== 'production') {
            try {
                const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : undefined;
                const vite = await createViteServer({
                    root: frontendRoot,
                    server: { middlewareMode: true, hmr: hmrPort ? { port: hmrPort } : undefined },
                    appType: 'spa'
                });
                app.use(vite.middlewares);
            } catch (err) {
                console.warn('⚠️ Vite dev middleware failed to start (HMR/ws may be in use). Continuing without middleware.', err && err.message ? err.message : err);
            }
    }
    else {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Campo Real Eventos running successfully at http://localhost:${PORT}`);
    });
}
startServer();
