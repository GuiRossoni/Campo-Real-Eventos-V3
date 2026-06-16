import { isUsingMySQL, mysqlPool, fallbackDb, saveFallbackDb } from '../../config/database.js';
export class UsersRepository {
    async registerUser(user) {
        if (isUsingMySQL && mysqlPool) {
            try {
                await mysqlPool.query('INSERT INTO users (id, name, email, ra, course, period, role, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user.id, user.name, user.email, user.ra || null, user.course || null, user.period || null, user.role, user.password || null]);
                return;
            }
            catch (e) {
                throw new Error(`Erro ao cadastrar usuário no MySQL: ${e.message}`);
            }
        }
        fallbackDb.users.push(user);
        saveFallbackDb();
    }
    async updateUser(id, updatedFields) {
        if (isUsingMySQL && mysqlPool) {
            try {
                const keys = Object.keys(updatedFields).filter(key => key !== 'id');
                if (keys.length > 0) {
                    const queryStr = `UPDATE users SET ${keys.map(k => `\`${k}\` = ?`).join(', ')} WHERE id = ?`;
                    const values = keys.map(k => updatedFields[k]).concat(id);
                    await mysqlPool.query(queryStr, values);
                }
                const [rows] = await mysqlPool.query('SELECT * FROM users WHERE id = ?', [id]);
                if (rows.length === 0)
                    throw new Error('Usuario nao encontrado');
                return rows[0];
            }
            catch (e) {
                throw new Error(`Erro ao atualizar usuário no MySQL: ${e.message}`);
            }
        }
        const idx = fallbackDb.users.findIndex(u => u.id === id);
        if (idx !== -1) {
            fallbackDb.users[idx] = { ...fallbackDb.users[idx], ...updatedFields };
            saveFallbackDb();
            return fallbackDb.users[idx];
        }
        throw new Error('Usuário não encontrado');
    }
    async getUsers() {
        if (isUsingMySQL && mysqlPool) {
            try {
                const [rows] = await mysqlPool.query('SELECT * FROM users');
                return rows.map((u) => ({
                    ...u,
                    ra: u.ra || undefined,
                    course: u.course || undefined,
                    period: u.period || undefined
                }));
            }
            catch {
                return fallbackDb.users;
            }
        }
        return fallbackDb.users;
    }
    async updateFinancialSettings(settings) {
        const payload = {
            pixKey: settings.pixKey || '',
            pixReceiverName: settings.pixReceiverName || 'Campo Real Eventos',
            updatedAt: settings.updatedAt || new Date().toISOString()
        };
        if (isUsingMySQL && mysqlPool) {
            try {
                await mysqlPool.query('INSERT INTO financial_settings (id, pixKey, pixReceiverName, updatedAt) VALUES (1, ?, ?, ?) ON DUPLICATE KEY UPDATE pixKey = VALUES(pixKey), pixReceiverName = VALUES(pixReceiverName), updatedAt = VALUES(updatedAt)', [payload.pixKey, payload.pixReceiverName, payload.updatedAt]);
                return payload;
            }
            catch (e) {
                throw new Error(`Erro ao atualizar configuração financeira no MySQL: ${e.message}`);
            }
        }
        fallbackDb.financialSettings = payload;
        saveFallbackDb();
        return payload;
    }
}
export const usersRepository = new UsersRepository();
