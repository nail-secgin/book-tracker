import Database from "better-sqlite3";

const booktracker = new Database("BookTracker.db");

booktracker.exec(`

    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        bio TEXT,
        UNIQUE (username),
        UNIQUE (email)
        
    );

    CREATE TABLE IF NOT EXISTS following (
        follower_id INTEGER NOT NULL,
        following_id INTEGER NOT NULL,
        PRIMARY KEY(follower_id, following_id),
        FOREIGN KEY (follower_id)
            REFERENCES user(id)
            ON DELETE CASCADE,
        FOREIGN KEY (following_id)
            REFERENCES user(id)
            ON DELETE CASCADE,
        CHECK (follower_id != following_id)
    );

    CREATE TABLE IF NOT EXISTS author (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        external_id TEXT NOT NULL,
        external_source TEXT NOT NULL,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        description TEXT,
        UNIQUE (external_id, external_source)
    );

    CREATE TABLE IF NOT EXISTS book_author (
        book_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) 
            REFERENCES books(id)
            ON DELETE CASCADE,
        FOREIGN KEY (author_id) 
            REFERENCES author(id)
            ON DELETE CASCADE,
        PRIMARY KEY (book_id, author_id)
    );

    CREATE TABLE IF NOT EXISTS genre (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        UNIQUE (name)
    );

    CREATE TABLE IF NOT EXISTS book_genre (
        book_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) 
            REFERENCES books(id)
            ON DELETE CASCADE,
        FOREIGN KEY (genre_id)
            REFERENCES genre(id)
            ON DELETE CASCADE,
        PRIMARY KEY (book_id, genre_id)
    );

    CREATE TABLE IF NOT EXISTS user_book (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        status TEXT 
            NOT NULL
            CHECK (status in ('want_to_read', 'reading', 'read', 'abandoned')),
        rating INTEGER CHECK (0 < rating <= 10),
        UNIQUE(user_id, book_id),
        FOREIGN KEY (user_id) 
            REFERENCES user(id)
            ON DELETE CASCADE,
        FOREIGN KEY (book_id) 
            REFERENCES books(id)
            ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reading (
        userbook_id INTEGER NOT NULL,
        start_date DATETIME NOT NULL,
        finish_date DATETIME,
        abandon_date DATETIME,
        PRIMARY KEY (userbook_id, start_date),
        FOREIGN KEY (userbook_id) 
            REFERENCES user_book(id)
            ON DELETE CASCADE,
        CHECK (finish_date IS NULL OR abandon_date IS NULL)
    );

    CREATE TABLE IF NOT EXISTS reviews (
        userbook_id INTEGER NOT NULL,
        privacy TEXT 
            NOT NULL 
            CHECK (privacy in ('public', 'private', 'unlisted', 'followers')),
        review_text TEXT NOT NULL,
        created_date DATETIME NOT NULL,
        update_date DATETIME,
        UNIQUE(userbook_id),
        FOREIGN KEY (userbook_id) 
            REFERENCES user_book(id)
            ON DELETE CASCADE
    );
`);


export default booktracker;