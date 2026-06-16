import mysql from 'mysql2/promise';
import fs from 'fs';
import { ENV } from './env.js';
import { SEEDED_USERS, SEEDED_EVENTS, SEEDED_WORKSHOPS, SEEDED_ENROLLMENTS, SEEDED_ATTENDANCE, SEEDED_BANNERS, SEEDED_LOGS } from '../data/seedData.js';
export let mysqlPool = null;
export let isUsingMySQL = false;
export let fallbackDb = {
    users: [...SEEDED_USERS],
    events: [...SEEDED_EVENTS],
    workshops: [...SEEDED_WORKSHOPS],
    enrollments: [...SEEDED_ENROLLMENTS],
    attendance: [...SEEDED_ATTENDANCE],
    certificates: [],
    banners: [...SEEDED_BANNERS],
    logs: [...SEEDED_LOGS],
    financialSettings: {
        pixKey: '',
        pixReceiverName: 'Campo Real Eventos',
        updatedAt: new Date(0).toISOString()
    }
};
export function setMySQLState(active) {
    isUsingMySQL = active;
}
export function loadFallbackDb() {
    try {
        if (fs.existsSync(ENV.FALLBACK_DB_PATH)) {
            const data = fs.readFileSync(ENV.FALLBACK_DB_PATH, 'utf-8');
            fallbackDb = JSON.parse(data);
            if (!fallbackDb.financialSettings) {
                fallbackDb.financialSettings = {
                    pixKey: '',
                    pixReceiverName: 'Campo Real Eventos',
                    updatedAt: new Date(0).toISOString()
                };
            }
            console.log('📌 [Config Database] Banco de dados local fallback carregado com sucesso!');
        }
        else {
            saveFallbackDb();
        }
    }
    catch (error) {
        console.error('⚠️ [Config Database] Erro ao ler banco de dados local:', error);
    }
}
export function saveFallbackDb() {
    try {
        fs.writeFileSync(ENV.FALLBACK_DB_PATH, JSON.stringify(fallbackDb, null, 2), 'utf-8');
    }
    catch (error) {
        console.error('⚠️ [Config Database] Erro ao salvar banco de dados local:', error);
    }
}
export async function initDatabase() {
    loadFallbackDb();
    if (!process.env.DB_HOST) {
        console.log('🔴 Variável DB_HOST não configurada. Operando no modo LOCAL FALLBACK (Salvo em arquivo).');
        return;
    }
    try {
        console.log(`🟡 Tentando conectar ao MySQL em: ${ENV.DB_HOST}:${ENV.DB_PORT} (Usuário: ${ENV.DB_USER})...`);
        const initPool = mysql.createPool({
            host: ENV.DB_HOST,
            port: ENV.DB_PORT,
            user: ENV.DB_USER,
            password: ENV.DB_PASSWORD,
            connectionLimit: 1
        });
        await initPool.query(`CREATE DATABASE IF NOT EXISTS \`${ENV.DB_NAME}\`;`);
        await initPool.end();
        mysqlPool = mysql.createPool({
            host: ENV.DB_HOST,
            port: ENV.DB_PORT,
            user: ENV.DB_USER,
            password: ENV.DB_PASSWORD,
            database: ENV.DB_NAME,
            connectionLimit: 10,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        await createMySQLTablesAndSeeds();
        isUsingMySQL = true;
        console.log('🟢 MYSQL CONECTADO E PRONTO COM SUCESSO! Banco de dados oficial sincronizado.');
    }
    catch (error) {
        console.log('🔴 Erro de conexão com o banco MySQL ou credenciais incorretas.');
        console.log(`Detecção técnica: ${error.message}`);
        console.log('📌 O servidor Express continuará em execução usando o banco persistido do local_db_fallback.json!');
    }
}
async function createMySQLTablesAndSeeds() {
    if (!mysqlPool)
        return;
    const connection = await mysqlPool.getConnection();
    try {
        // 1. Users
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        ra VARCHAR(50) NULL,
        course VARCHAR(150) NULL,
        period VARCHAR(50) NULL,
        role VARCHAR(50) NOT NULL,
        password VARCHAR(100) NULL
      );
    `);
        // 2. Eventos
        await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        banner VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        startDate VARCHAR(50) NOT NULL,
        endDate VARCHAR(50) NOT NULL,
        startTime VARCHAR(20) NOT NULL,
        endTime VARCHAR(20) NOT NULL,
        category VARCHAR(100) NOT NULL,
        maxParticipants INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        creatorId VARCHAR(100) NOT NULL,
        creatorName VARCHAR(255) NOT NULL,
        isFeatured BOOLEAN NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `);
        // 3. Workshops
        await connection.query(`
      CREATE TABLE IF NOT EXISTS workshops (
        id VARCHAR(100) PRIMARY KEY,
        eventId VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        instructor VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(20) NOT NULL,
        maxParticipants INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        enrolledCount INT NOT NULL DEFAULT 0
      );
    `);
        // 4. Relacionamentos de inscrições
        await connection.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(100) PRIMARY KEY,
        userId VARCHAR(100) NOT NULL,
        userEmail VARCHAR(150) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userRa VARCHAR(50) NULL,
        eventId VARCHAR(100) NOT NULL,
        eventName VARCHAR(255) NOT NULL,
        selectedWorkshops TEXT NOT NULL, -- JSON formatted array
        totalValue DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status VARCHAR(50) NOT NULL,
        createdAt VARCHAR(50) NOT NULL
      );
    `);
        // 5. Presença
        await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(100) PRIMARY KEY,
        userId VARCHAR(100) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userEmail VARCHAR(150) NOT NULL,
        userRa VARCHAR(50) NULL,
        eventId VARCHAR(100) NOT NULL,
        workshopId VARCHAR(100) NULL,
        checkedInAt VARCHAR(50) NOT NULL,
        checkedInBy VARCHAR(255) NOT NULL
      );
    `);
        // 6. Certificados
        await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(100) PRIMARY KEY,
        userId VARCHAR(100) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userRa VARCHAR(50) NULL,
        eventId VARCHAR(100) NOT NULL,
        eventName VARCHAR(255) NOT NULL,
        hours INT NOT NULL,
        hash VARCHAR(100) NOT NULL,
        issuedAt VARCHAR(50) NOT NULL,
        coordinationSignature VARCHAR(255) NOT NULL
      );
    `);
        // 7. System logs
        await connection.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id VARCHAR(100) PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        userEmail VARCHAR(150) NOT NULL,
        userRole VARCHAR(50) NOT NULL,
        details TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL
      );
    `);
        // 8. Banners
        await connection.query(`
      CREATE TABLE IF NOT EXISTS home_banners (
        id VARCHAR(100) PRIMARY KEY,
        imageUrl VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        linkToEventId VARCHAR(100) NULL,
        isActive BOOLEAN NOT NULL DEFAULT 1
      );
    `);
                // 9. Configurações financeiras
                await connection.query(`
            CREATE TABLE IF NOT EXISTS financial_settings (
                id INT PRIMARY KEY,
                pixKey VARCHAR(255) NOT NULL,
                pixReceiverName VARCHAR(255) NULL,
                updatedAt VARCHAR(50) NOT NULL
            );
        `);
        const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
        if (userRows[0].count === 0) {
            console.log('🌱 Alimentando usuários iniciais no MySQL...');
            for (const u of SEEDED_USERS) {
                await connection.query('INSERT INTO users (id, name, email, ra, course, period, role, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [u.id, u.name, u.email, u.ra || null, u.course || null, u.period || null, u.role, u.password || null]);
            }
        }
        const [eventRows] = await connection.query('SELECT COUNT(*) as count FROM events');
        if (eventRows[0].count === 0) {
            console.log('🌱 Alimentando eventos iniciais no MySQL...');
            for (const e of SEEDED_EVENTS) {
                await connection.query('INSERT INTO events (id, name, description, banner, location, startDate, endDate, startTime, endTime, category, maxParticipants, status, creatorId, creatorName, isFeatured, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [e.id, e.name, e.description, e.banner, e.location, e.startDate, e.endDate, e.startTime, e.endTime, e.category, e.maxParticipants, e.status, e.creatorId, e.creatorName, e.isFeatured ? 1 : 0, e.price]);
            }
        }
        const [wsRows] = await connection.query('SELECT COUNT(*) as count FROM workshops');
        if (wsRows[0].count === 0) {
            console.log('🌱 Alimentando workshops iniciais no MySQL...');
            for (const w of SEEDED_WORKSHOPS) {
                await connection.query('INSERT INTO workshops (id, eventId, name, description, instructor, date, time, maxParticipants, price, enrolledCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [w.id, w.eventId, w.name, w.description, w.instructor, w.date, w.time, w.maxParticipants, w.price, w.enrolledCount]);
            }
        }
        const [enrollRows] = await connection.query('SELECT COUNT(*) as count FROM enrollments');
        if (enrollRows[0].count === 0) {
            console.log('🌱 Alimentando inscrições iniciais no MySQL...');
            for (const en of SEEDED_ENROLLMENTS) {
                await connection.query('INSERT INTO enrollments (id, userId, userEmail, userName, userRa, eventId, eventName, selectedWorkshops, totalValue, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [en.id, en.userId, en.userEmail, en.userName, en.userRa || null, en.eventId, en.eventName, JSON.stringify(en.selectedWorkshops), en.totalValue, en.status, en.createdAt]);
            }
        }
        const [attRows] = await connection.query('SELECT COUNT(*) as count FROM attendance');
        if (attRows[0].count === 0) {
            console.log('🌱 Alimentando registros de presença no MySQL...');
            for (const a of SEEDED_ATTENDANCE) {
                await connection.query('INSERT INTO attendance (id, userId, userName, userEmail, userRa, eventId, workshopId, checkedInAt, checkedInBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [a.id, a.userId, a.userName, a.userEmail, a.userRa || null, a.eventId, a.workshopId || null, a.checkedInAt, a.checkedInBy]);
            }
        }
        const [bannerRows] = await connection.query('SELECT COUNT(*) as count FROM home_banners');
        if (bannerRows[0].count === 0) {
            console.log('🌱 Alimentando banners no MySQL...');
            for (const b of SEEDED_BANNERS) {
                await connection.query('INSERT INTO home_banners (id, imageUrl, title, subtitle, linkToEventId, isActive) VALUES (?, ?, ?, ?, ?, ?)', [b.id, b.imageUrl, b.title, b.subtitle, b.linkToEventId || null, b.isActive ? 1 : 0]);
            }
        }
        const [logRows] = await connection.query('SELECT COUNT(*) as count FROM system_logs');
        if (logRows[0].count === 0) {
            console.log('🌱 Alimentando logs iniciais no MySQL...');
            for (const l of SEEDED_LOGS) {
                await connection.query('INSERT INTO system_logs (id, action, userEmail, userRole, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)', [l.id, l.action, l.userEmail, l.userRole, l.details, l.timestamp]);
            }
        }
        const [financialRows] = await connection.query('SELECT COUNT(*) as count FROM financial_settings');
        if (financialRows[0].count === 0) {
            await connection.query('INSERT INTO financial_settings (id, pixKey, pixReceiverName, updatedAt) VALUES (1, ?, ?, ?)', ['', 'Campo Real Eventos', new Date(0).toISOString()]);
        }
        console.log('🎉 [Config Database] Tabelas criadas e dados semeados com sucesso!');
    }
    finally {
        connection.release();
    }
}
export async function getFullState() {
    if (!isUsingMySQL || !mysqlPool) {
        return fallbackDb;
    }
    const connection = await mysqlPool.getConnection();
    try {
        const [users] = await connection.query('SELECT * FROM users');
        const [events] = await connection.query('SELECT * FROM events');
        const [workshops] = await connection.query('SELECT * FROM workshops');
        const [enrollments] = await connection.query('SELECT * FROM enrollments');
        const [attendance] = await connection.query('SELECT * FROM attendance');
        const [certificates] = await connection.query('SELECT * FROM certificates');
        const [banners] = await connection.query('SELECT * FROM home_banners');
        const [logs] = await connection.query('SELECT * FROM system_logs ORDER BY timestamp DESC');
        const [financialSettingsRows] = await connection.query('SELECT * FROM financial_settings WHERE id = 1 LIMIT 1');
        const financialSettings = financialSettingsRows[0] || { pixKey: '', pixReceiverName: 'Campo Real Eventos', updatedAt: new Date(0).toISOString() };
        return {
            users: users.map((u) => ({ ...u, ra: u.ra || undefined, course: u.course || undefined, period: u.period || undefined, institution: u.institution || undefined })),
            events: events.map((e) => ({ ...e, isFeatured: !!e.isFeatured, price: Number(e.price) })),
            workshops: workshops.map((w) => ({ ...w, price: Number(w.price), enrolledCount: Number(w.enrolledCount) })),
            enrollments: enrollments.map((en) => ({
                ...en,
                userRa: en.userRa || undefined,
                totalValue: Number(en.totalValue),
                selectedWorkshops: JSON.parse(en.selectedWorkshops || '[]')
            })),
            attendance: attendance.map((a) => ({ ...a, userRa: a.userRa || undefined, workshopId: a.workshopId || undefined })),
            certificates: certificates.map((c) => ({ ...c, userRa: c.userRa || undefined, hours: Number(c.hours) })),
            banners: banners.map((b) => ({ ...b, isActive: !!b.isActive, linkToEventId: b.linkToEventId || undefined })),
            logs: logs.map((l) => ({ ...l })),
            financialSettings: {
                pixKey: financialSettings.pixKey || '',
                pixReceiverName: financialSettings.pixReceiverName || 'Campo Real Eventos',
                updatedAt: financialSettings.updatedAt || new Date(0).toISOString()
            }
        };
    }
    catch (error) {
        console.error('MySQL query state error, defaulting to fallbackDb:', error);
        return fallbackDb;
    }
    finally {
        connection.release();
    }
}
