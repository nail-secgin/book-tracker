import { Router } from "express";
import { type Request, type Response } from 'express';
import db from "./database.js"

const router = Router();

// Get books from database 'books.db'
router.get("/books", (req, res) => {
    const all_books = db.prepare(`
        SELECT * FROM books;
    `);

    res.json(all_books.all())
})

// Post new book to database
router.post("/books", (req, res) => {
    const new_book = req.body;

    // Error handling for invalid input data
    if(!new_book.title){
        res.status(400).send("Title invalid")
        return;
    }

    if(
        !Number.isInteger(new_book.year) || 
        (new_book.year > 2050 || new_book.year < 1600)
    ) {
        res.status(400).send("Year invalid")
        return;
    }

    if(!new_book.author){
        res.status(400).send("Author invalid")
        return;
    }

    try {
        // Insert new book into database
        const statement = db.prepare(`
            INSERT INTO books (title, year, author)
            VALUES (?, ?, ?)
        `);
        statement.run(new_book.title, new_book.year, new_book.author);
    } catch (error) {
        if (error instanceof Error) {
            // ID conflict
            res.status(409).send("ID already taken")
            return;
        }
    }

    // Send entire database data to /books
    const all_books = db.prepare(`
        SELECT * FROM books;
    `)

    res.json(all_books.all());
    
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