import { Router } from "express";
import { type Request, type Response } from 'express';
import db from "./database.js"
import { SqliteError } from "better-sqlite3";
import { getWorkData } from "./external_api.js";
import { BookDeletionError, BookNotFoundError, ExternalApiError, InvalidAuthorDataError } from "./errors.js";

const router = Router();

interface BookData {
    id: number;
    external_id: string;
    external_source: string;
    title: string;
    year: number | undefined;
    description: string | undefined;
};

interface BookToFrontend {
    id: number;
    external_id: string;
    external_source: string;
    title: string;
    year: number | undefined;
    authors?: string[];
    description: string | undefined;
};

interface AuthorData {
    name: string
};

// Get books from database 'books.db'
router.get("/books", (req, res) => {
    const all_books = db.prepare(`
        SELECT * FROM books;
    `);
    
    const book_authors = db.prepare(`
        SELECT author.name FROM book_author
        JOIN author ON author.id = book_author.author_id
        WHERE book_author.book_id = ?
    `);

    const all_books_result:BookToFrontend[] = []

    for (const book of all_books.all() as BookData[]) {
        const authors = book_authors.all(book.id) as AuthorData[]
        all_books_result.push({
            id: book.id,
            external_id: book.external_id,
            external_source: book.external_source,
            title: book.title,
            year: book.year,
            authors: authors.map(author => author.name),
            description: book.description
        })
    }

    res.json(all_books_result)
})


// Post new book to database
router.post("/books", async (req, res) => {
    let book_id;

    const inputTitle = req.body.title
    
    // Error handling for invalid input data
    if(!inputTitle){
        res.status(400).send("Title invalid")
        return;
    }

    try {
        const new_book = await getWorkData(inputTitle);
        // SQL-Transaction
        // If one SQL-operation fails, all of them within the function will be reverted
        const transaction = db.transaction(() => {
            // Insert new book into database
            const statement_book = db.prepare(`
                INSERT INTO books (external_id, external_source, title, year)
                VALUES (?, ?, ?, ?)
            `);
            const book_run = statement_book.run(new_book.external_id, new_book.external_source, new_book.title, new_book.year);
            book_id = book_run.lastInsertRowid 
            // Insert author(s) into database if not already done and get ID(s)
            const statement_author = db.prepare(`
                INSERT OR IGNORE INTO author (external_id, external_source, name)
                VALUES (?, ?, ?)
            `);
            
            const author_check = db.prepare(`
                SELECT id FROM author
                WHERE external_id = ?
                AND external_source = ?
            `);
            
            let author_id: number;
            const author_id_list:number[] = [];

            // Error handling: Check if array with authors and array with keys are available and identical
            if (new_book.authors && new_book.author_keys) {
                if(new_book.authors.length === new_book.author_keys.length) {
                    // Insert each author key and author into 'author' table
                    for (let i = 0; i < new_book.authors.length; i++) {
                        statement_author.run(new_book.author_keys[i], new_book.external_source, new_book.authors[i]);
                        const author_result = author_check.get(new_book.author_keys[i], new_book.external_source) as {id: number} | undefined;
                        // Error handling: Throw error if author not found
                        if(author_result) {
                            author_id = author_result.id;
                        } else {
                            throw new InvalidAuthorDataError();
                        }

                        author_id_list.push(author_id);
                    }
                } else {
                    throw new InvalidAuthorDataError();
                }

                // Insert each author into 'book_author' table
                const statement_book_author = db.prepare(`
                    INSERT INTO book_author (book_id, author_id)
                    VALUES (?, ?)
                `);

                for (let author_id of author_id_list) {
                    statement_book_author.run(book_id, author_id);
                }
                
            }
        });
            
        transaction();

        // Send added book to /books
        const books = db.prepare(`
            SELECT * FROM books
            WHERE id = ?;
        `);
        const book_data:BookData = books.get(book_id) as BookData;
        
        // Get author_id from table 'book_author' and with that ID get author names from table 'author'
        const book_authors = db.prepare(`
            SELECT author.name FROM book_author
            JOIN author ON author.id = book_author.author_id
            WHERE book_author.book_id = ?
        `);
        const authors = book_authors.all(book_id) as AuthorData[]
        
        const book:BookToFrontend = {
            id: book_data.id,
            external_id: book_data.external_id,
            external_source: book_data.external_source,
            title: book_data.title,
            year: book_data.year,
            authors: authors.map(author => author.name),
            description: book_data.description
        };

        res.json(book);

    } catch (error) {
        // Error handling
        if(error instanceof SqliteError && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            res.status(409).send("Book already exists");
            return;
        }

        if (error instanceof InvalidAuthorDataError) {
            res.status(400).send(error.message)
            return;
        }

        if (error instanceof BookNotFoundError) {
            res.status(404).send(error.message)
            return;
        }

        if (error instanceof ExternalApiError) {
            res.status(502).send(error.message)
            return;
        }

        if (error instanceof Error) {
            res.status(500).send(error.message)
            return;
        }
    }
});


// Get Book with the ID after /books/*
router.get("/books/:book_id", (req: Request<{ book_id: string}>, res: Response) => { 
    const current_book = db.prepare(`
        SELECT * FROM books
        WHERE id = ?;
    `);
    // Get author_id from table 'book_author' and with that ID get author names from table 'author'
    const current_book_authors = db.prepare(`
        SELECT author.name FROM book_author
        JOIN author ON author.id = book_author.author_id
        WHERE book_author.book_id = ? 
    `);
    
    try {
        // Book with book ID from request parameters
        const book:BookData = current_book.get(Number(req.params.book_id)) as BookData;

        // Error handling
        if(!book) {
            throw new BookNotFoundError();
        }

        const authors = current_book_authors.all(book.id) as AuthorData[]
        const book_response:BookToFrontend = {
            id: book.id,
            external_id: book.external_id,
            external_source: book.external_source,
            title: book.title,
            year: book.year,
            authors: authors.map(author => author.name),
            description: book.description
        };

        res.json(book_response);

    } catch(error) {
        if (error instanceof BookNotFoundError) {
            res.status(404).send(error.message)
            return;
        }
    }
})


// Delete Book
router.delete("/books/:book_id", (req, res) => {
    const id = Number(req.params.book_id);

    // Deletion
    const statement = db.prepare(`
        DELETE FROM books
        WHERE id = ?;    
    `)
    
    try {
        // Error handling
        const statement_changes = statement.run(id).changes

        if(statement_changes === 0) {
            throw new BookDeletionError();
        }

        // Send updated list
        const all_books = db.prepare(`
            SELECT * FROM books;
        `)
        res.json(all_books.all());

    } catch(error) {
        if (error instanceof BookDeletionError) {
            res.status(404).send(error.message)
            return;
        }
    }
});

export default router;