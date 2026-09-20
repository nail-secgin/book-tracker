import express from "express";
import cors from "cors"

const app = express();
app.use(cors());


class Book {
	public id: number;
	public title: string;
	public year: number;
	public author: string;

	public constructor(id: number, title: string, year: number, author: string) {
		this.id = id;
		this.title = title;
		this.year = year;
		this.author = author;
	}
}

const books: Book[] = [];

const new_book_1 = new Book(0, "test", 0, "test");
const new_book_2 = new Book(1, "test", 1, "test");

books.push(new_book_1);
books.push(new_book_2);

app.get("/books", (req, res) => {
    res.json({
		books
	});
})

app.listen(3000)