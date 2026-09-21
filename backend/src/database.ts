import Database from "better-sqlite3";

const db = new Database("books.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT,
        year INTEGER,
        author TEXT
    );
`);

export default db;