import { Router } from 'express';
import { isUsingMySQL, mysqlPool, fallbackDb, saveFallbackDb } from '../../config/database.js';
const router = Router();
router.post('/api/db/write-log', async (req, res) => {
    try {
        const log = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO system_logs (id, action, userEmail, userRole, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)', [log.id, log.action, log.userEmail, log.userRole, log.details, log.timestamp]);
        }
        else {
            fallbackDb.logs.unshift(log);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
export default router;
