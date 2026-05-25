import { Router } from 'express';
import { isUsingMySQL, mysqlPool, fallbackDb, saveFallbackDb } from '../../config/database.js';
const router = Router();
router.post('/api/db/write-event-save', async (req, res) => {
    try {
        const event = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO events (id, name, description, banner, location, startDate, endDate, startTime, endTime, category, maxParticipants, status, creatorId, creatorName, isFeatured, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [event.id, event.name, event.description, event.banner, event.location, event.startDate, event.endDate, event.startTime, event.endTime, event.category, event.maxParticipants, event.status, event.creatorId, event.creatorName, event.isFeatured ? 1 : 0, event.price]);
        }
        else {
            fallbackDb.events.unshift(event);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-event-update', async (req, res) => {
    try {
        const { id, updatedFields } = req.body;
        let result;
        if (isUsingMySQL && mysqlPool) {
            const keys = Object.keys(updatedFields).filter(key => key !== 'id');
            if (keys.length > 0) {
                const queryStr = `UPDATE events SET ${keys.map(k => `\`${k}\` = ?`).join(', ')} WHERE id = ?`;
                const values = keys.map(k => {
                    const val = updatedFields[k];
                    if (k === 'isFeatured')
                        return val ? 1 : 0;
                    return val;
                }).concat(id);
                await mysqlPool.query(queryStr, values);
            }
            const [rows] = await mysqlPool.query('SELECT * FROM events WHERE id = ?', [id]);
            result = rows[0];
        }
        else {
            const idx = fallbackDb.events.findIndex(e => e.id === id);
            if (idx !== -1) {
                fallbackDb.events[idx] = { ...fallbackDb.events[idx], ...updatedFields };
                saveFallbackDb();
                result = fallbackDb.events[idx];
            }
            else {
                throw new Error('Evento não encontrado');
            }
        }
        res.json({ success: true, data: result });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-event-delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('DELETE FROM events WHERE id = ?', [id]);
            await mysqlPool.query('DELETE FROM workshops WHERE eventId = ?', [id]);
        }
        else {
            fallbackDb.events = fallbackDb.events.filter(e => e.id !== id);
            fallbackDb.workshops = fallbackDb.workshops.filter(w => w.eventId !== id);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-workshop-save', async (req, res) => {
    try {
        const workshop = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO workshops (id, eventId, name, description, instructor, date, time, maxParticipants, price, enrolledCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [workshop.id, workshop.eventId, workshop.name, workshop.description, workshop.instructor, workshop.date, workshop.time, workshop.maxParticipants, workshop.price, workshop.enrolledCount]);
        }
        else {
            fallbackDb.workshops.push(workshop);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-workshop-delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('DELETE FROM workshops WHERE id = ?', [id]);
        }
        else {
            fallbackDb.workshops = fallbackDb.workshops.filter(w => w.id !== id);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
export default router;
