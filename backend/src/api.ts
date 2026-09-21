import { Router } from "express";
import { Book, books } from "./books.js";
import { type Request, type Response } from 'express';

const router = Router();

// Get Array 'books' from books.ts
router.get("/books", (req, res) => {
    res.json({
		books
	});
})

// Post new book to list in books.ts
router.post("/books", (req, res) => {
    const new_book = req.body;
    books.push(new Book(Number(new_book.id), new_book.title, Number(new_book.year), new_book.author));
    res.json({books})
});

// Get Book with the ID after /books/*
router.get("/books/:book_id", (req: Request<{ book_id: string}>, res: Response) => { 
    const current_book_data = books[Number(req.params.book_id)]

    if(current_book_data == undefined) {
        res.status(404).send("Book not found")
    } else {
        res.json(current_book_data);
    }
})

export default router;