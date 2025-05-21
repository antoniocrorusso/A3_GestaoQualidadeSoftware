import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const connection = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

export default connection;
