import { Router } from "express";
import { Book, books } from "./books.js";

const router = Router();


router.get("/books", (req, res) => {
    res.json({
		books
	});
})

export default router;