import { Router } from "express";
import { type Request, type Response } from 'express';
import db from "./database.js"
import { getWorkData } from "./external_api.js";
import { error } from "node:console";

const router = Router();

// Get books from database 'books.db'
router.get("/books", (req, res) => {
    const all_books = db.prepare(`
        SELECT * FROM books;
    `);

    res.json(all_books.all())
})

// Post new book to database
router.post("/books", async (req, res) => {
    const inputTitle = req.body.title
    
    // Error handling for invalid input data
    if(!inputTitle){
        res.status(400).send("Title invalid")
        return;
    }

    const new_book = await getWorkData(inputTitle);
    try {
        // Insert new book into database
        const statement_book = db.prepare(`
            INSERT INTO books (external_id, external_source, title, year)
            VALUES (?, ?, ?, ?)
        `);
        const book_run = statement_book.run(new_book.external_id, new_book.external_source, new_book.title, new_book.year);

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
        const author_id_list:(typeof author_id)[] = [];

        if (new_book.author && new_book.author_key) {
            if(new_book.author.length === new_book.author_key.length) {
                for (let i = 0; i < new_book.author.length; i++) {

                    statement_author.run(new_book.author_key[i], new_book.external_source, new_book.author[i]);

                    
                    const author_result = author_check.get(new_book.author_key[i], new_book.external_source) as {id: number} | undefined;
                    if(author_result) {
                        author_id = author_result.id
                    } else {
                        throw("Author ID not found");
                    }
                    author_id_list.push(author_id);
                }
        } else {
            throw("Insert failed because of conflicted author data");
        }

        
    const statement_book_author = db.prepare(`
        INSERT INTO book_author (book_id, author_id)
        VALUES (?, ?)
    `);
    for (var i in author_id_list) {
        statement_book_author.run(book_run.lastInsertRowid, author_id_list[i]);
    }
        
    }
    } catch (error) {
        if (error instanceof Error) {
            // 
            res.status(409).send("Error")
            return;
        }
    }
    // Send added book to /books
    const books = db.prepare(`
        SELECT * FROM books
        WHERE external_id = ?;
    `)

    res.json(books.get(new_book.external_id));
    
});

// Get Book with the ID after /books/*
router.get("/books/:book_id", (req: Request<{ book_id: string}>, res: Response) => { 
    const current_book = db.prepare(`
        SELECT * FROM books
        WHERE id = ?;
    `)
    
    // Book with book ID from request parameters
    const book = current_book.get(Number(req.params.book_id))
    
    // Error handling
    if(book == undefined) {
        res.status(404).send("Book not found")
        return;
    } else {
        res.json(book);
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
    
    // Error handling
    const statement_changes = statement.run(id).changes

    if(statement_changes === 0) {
        res.status(400).send("Deletion unsuccessful")
        return;
    }


    // Send updated list
    const all_books = db.prepare(`
        SELECT * FROM books;
    `)
    res.json(all_books.all());
    
});

// Update Book
router.put("/books/:book_id", (req, res) => {
    const id = Number(req.params.book_id);
    const updated_data = req.body;


    // Error handling
    if(!updated_data.title){
        res.status(400).send("Title invalid")
        return;
    }

    if(
        !Number.isInteger(updated_data.year) || 
        (updated_data.year > 2050 || updated_data.year < 1600)
    ) {
        res.status(400).send("Year invalid")
        return;
    }

    if(!updated_data.author){
        res.status(400).send("Author invalid")
        return;
    }

    // Update edited book data
    const current_book = db.prepare(`
        UPDATE books
        SET title = ?,
            year = ?,
            author = ?
        WHERE id = ?;
    `)  

    
    // Error handling
    const statement_changes = current_book.run(updated_data.title, Number(updated_data.year), updated_data.author, id).changes

    if(statement_changes === 0) {
        res.status(404).send("Book for Book ID not available")
        return;
    }
    
    // Send updated book
    const updated_books = db.prepare(`
        SELECT * FROM books
        WHERE id = ?;
    `)
    res.json(updated_books.get(id));
});

export default router;