import { Router } from "express";
import { type Request, type Response } from 'express';
import db from "./database.js"

const router = Router();

// Getbooks from database 'books.db'
router.get("/books", (req, res) => {
    const all_books = db.prepare(`
        SELECT * FROM books;
    `);

    res.json(all_books.all())
})

// Post new book to database
router.post("/books", (req, res) => {
    const new_book = req.body;
    const statement = db.prepare(`
        INSERT INTO books (id, title, year, author)
        VALUES (?, ?, ?, ?)
    `);
    statement.run(new_book.id, new_book.title, new_book.year, new_book.author);

    const all_books = db.prepare(`
        SELECT * FROM books;
    `)

    res.json(all_books.all())
});

// Get Book with the ID after /books/*
router.get("/books/:book_id", (req: Request<{ book_id: string}>, res: Response) => { 
    const current_book = db.prepare(`
        SELECT * FROM books
        WHERE id = ?;
    `)

    const book = current_book.get(Number(req.params.book_id))

    if(book == undefined) {
        res.status(404).send("Book not found")
    } else {
        res.json(book);
    }
})

export default router;