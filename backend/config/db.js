import mysql from "mysql2/promise"

let pool

export const initMySQL = async () => {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "malaexpress",
    port: "3306",
    waitForConnections: true,
    connectionLimit: 10
  })
}

export const getConnection = () => {
  return pool
}