import { Router } from 'express';
import { isUsingMySQL, mysqlPool, fallbackDb, saveFallbackDb } from '../../config/database.js';
const router = Router();
router.post('/api/db/write-banner-save', async (req, res) => {
    try {
        const banner = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO home_banners (id, imageUrl, title, subtitle, linkToEventId, isActive) VALUES (?, ?, ?, ?, ?, ?)', [banner.id, banner.imageUrl, banner.title, banner.subtitle, banner.linkToEventId || null, banner.isActive ? 1 : 0]);
        }
        else {
            fallbackDb.banners.push(banner);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-banner-toggle', async (req, res) => {
    try {
        const { id } = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('UPDATE home_banners SET isActive = NOT isActive WHERE id = ?', [id]);
        }
        else {
            const idx = fallbackDb.banners.findIndex(b => b.id === id);
            if (idx !== -1) {
                fallbackDb.banners[idx].isActive = !fallbackDb.banners[idx].isActive;
                saveFallbackDb();
            }
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
export default router;
