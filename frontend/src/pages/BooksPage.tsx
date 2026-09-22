  import { useEffect, useState } from 'react';
  import BookCard from '../components/BookCard';
  import {type Book} from "../types/Book.js";
   

    function BooksPage() {
        // books uses interface 'Book'
        const [books, setBooks] = useState<Book[]>([]);

        // Function to request all data from /books
        async function loadBooks() {
            // 'await' pauses function and waits for promise
            // 'fetch' requests data from URL and returns a promise
            const response = await fetch("http://localhost:3000/books");
            // 'data' contains JSON data returned by the API, including information of the elements from database 'book' like 'id' or 'title'
            const data = await response.json();
            setBooks(data);
        }

        useEffect(() => {
            loadBooks();
        }, []);

        return(
            <>
                <h1>Books</h1>
                {books.map(book => (
                    <BookCard key={book.id} book={book}/>
                ))}
            </>
        );
    }
    export default BooksPage;
    