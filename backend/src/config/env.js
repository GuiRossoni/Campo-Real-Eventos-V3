import path from 'path';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

export const ENV = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'camporeal_eventos',
    PORT: parseInt(process.env.PORT || '3000', 10),
    FALLBACK_DB_PATH: path.resolve(process.cwd(), 'local_db_fallback.json'),
    NODE_ENV: process.env.NODE_ENV || 'development'
};
