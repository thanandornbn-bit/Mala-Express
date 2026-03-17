import mysql from 'mysql2'

const conn = null;

const initMysql = async () => {
    conn = await mysql.createConnection({
        host:'localhost',
        user: 'root',
        password: '1234',
        database: 'malaexpress',
        prot: '3306'
    })
}

export const getDB = () => conn