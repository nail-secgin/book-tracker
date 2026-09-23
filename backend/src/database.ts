import Database from "better-sqlite3";

const db = new Database("books.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        author TEXT NOT NULL
    );
`);

export default db;