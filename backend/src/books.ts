
export class Book {
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

// List of objects from class Book
export const books: Book[] = [];

// Test
const test_book_1 = new Book(0, "test_1", 1900, "test_author_1")
const test_book_2 = new Book(1, "test_2", 1901, "test_author_2")
const test_book_3 = new Book(2, "test_3", 1902, "test_author_3")

books.push(test_book_1)
books.push(test_book_2)
books.push(test_book_3)