  import { useEffect, useState } from 'react';

    // Interface identical to class Book
    interface Book {
        id: number;
        title: string;
        year: number;
        author: string;
    }

    function BooksPage() {
        // books uses interface 'Book' which is identical to class 'Book'
        const [books, setBooks] = useState<Book[]>([]);

        // Function to request all data from /books
        async function loadBooks() {
            // 'await' pauses function and waits for promise
            // 'fetch' requests data from URL and returns a promise
            const response = await fetch("http://localhost:3000/books");
            // 'data' contains JSON data returned by the API, including information of the objects from class 'Book' like 'id' or 'title'
            const data = await response.json();
            setBooks(data.books);
        }

        useEffect(() => {
            loadBooks();
        }, []);

        return(
            <>
                <h1>Books</h1>
                {books.map(book => (
                    <p key={book.id}>
                        {book.title} <br/> 
                        Book ID: {book.id} <br/>
                        Book Year: {book.year} <br/>
                        Book Author: {book.author} <br/>
                        <br/>
                    </p>
                ))}
            </>
        );
    }
    export default BooksPage;
    