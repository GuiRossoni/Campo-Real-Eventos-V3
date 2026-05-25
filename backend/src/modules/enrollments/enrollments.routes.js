import { Router } from 'express';
import { isUsingMySQL, mysqlPool, fallbackDb, saveFallbackDb } from '../../config/database.js';
const router = Router();
router.post('/api/db/write-enrollment-save', async (req, res) => {
    try {
        const enrollment = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO enrollments (id, userId, userEmail, userName, userRa, eventId, eventName, selectedWorkshops, totalValue, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [enrollment.id, enrollment.userId, enrollment.userEmail, enrollment.userName, enrollment.userRa || null, enrollment.eventId, enrollment.eventName, JSON.stringify(enrollment.selectedWorkshops), enrollment.totalValue, enrollment.status, enrollment.createdAt]);
        }
        else {
            fallbackDb.enrollments.push(enrollment);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-enrollment-status', async (req, res) => {
    try {
        const { id, status } = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);
        }
        else {
            const idx = fallbackDb.enrollments.findIndex(e => e.id === id);
            if (idx !== -1) {
                fallbackDb.enrollments[idx].status = status;
                saveFallbackDb();
            }
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-workshop-increment', async (req, res) => {
    try {
        const { workshopIds } = req.body;
        if (isUsingMySQL && mysqlPool) {
            for (const wId of workshopIds) {
                await mysqlPool.query('UPDATE workshops SET enrolledCount = enrolledCount + 1 WHERE id = ?', [wId]);
            }
        }
        else {
            fallbackDb.workshops = fallbackDb.workshops.map(w => {
                if (workshopIds.includes(w.id)) {
                    return { ...w, enrolledCount: w.enrolledCount + 1 };
                }
                return w;
            });
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-attendance-save', async (req, res) => {
    try {
        const att = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO attendance (id, userId, userName, userEmail, userRa, eventId, workshopId, checkedInAt, checkedInBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [att.id, att.userId, att.userName, att.userEmail, att.userRa || null, att.eventId, att.workshopId || null, att.checkedInAt, att.checkedInBy]);
        }
        else {
            fallbackDb.attendance.push(att);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-attendance-remove', async (req, res) => {
    try {
        const { id } = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('DELETE FROM attendance WHERE id = ?', [id]);
        }
        else {
            fallbackDb.attendance = fallbackDb.attendance.filter(a => a.id !== id);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
router.post('/api/db/write-certificate-save', async (req, res) => {
    try {
        const cert = req.body;
        if (isUsingMySQL && mysqlPool) {
            await mysqlPool.query('INSERT INTO certificates (id, userId, userName, userRa, eventId, eventName, hours, hash, issuedAt, coordinationSignature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [cert.id, cert.userId, cert.userName, cert.userRa || null, cert.eventId, cert.eventName, cert.hours, cert.hash, cert.issuedAt, cert.coordinationSignature]);
        }
        else {
            fallbackDb.certificates.push(cert);
            saveFallbackDb();
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
export default router;
