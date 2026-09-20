import { Router } from "express";
import { Book, books } from "./books.js";

const router = Router();

// Get Array 'books' from books.ts
router.get("/books", (req, res) => {
    res.json({
		books
	});
})

// 
router.post("/books", (req, res) => {
    const new_book = req.body;
    books.push(new Book(Number(new_book.id), new_book.title, Number(new_book.year), new_book.author));
    res.json({books})
});

export default router;