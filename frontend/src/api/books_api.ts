import { type Book } from "../types/Book.js";


// Request all books from /books
export async function getBooks(): Promise<Book[]> {

    const response = await fetch("http://localhost:3000/books");

    if (!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info);
    }

    return response.json();
}

// Request book with certain ID
export async function getBook(book_id: number): Promise<Book> {
    const response = await fetch("http://localhost:3000/books/" + book_id );

    if (!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info);
    }

    return response.json();
}

// Delete book with certain ID
export async function deleteBook(book_id: number): Promise<void> {
    const response = await fetch("http://localhost:3000/books/" + book_id, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info);
    }
}

// Add book with intended data
export async function addBook(title: string): Promise<void> {
    const new_book = {
        title: title
    };

    const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_book)
    });

    if(!response.ok) {
        const error_info = await response.text();
        throw new Error(error_info)
    }
}
