  import { useEffect, useState } from 'react';
  import BookCard from '../components/BookCard';
  import {type Book} from "../types/Book.js";
  import { getBooks } from "../api/books_api.js"

  
    function BooksPage() {
        // books uses interface 'Book'
        const [books, setBooks] = useState<Book[]>([]);
        const [error, setError] = useState("");
        
        async function loadBooks() {
            try {
                const loaded_books = await getBooks();
                setBooks(loaded_books);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            }
        }

        useEffect(() => {
            loadBooks();
        }, []);

        return(
            <>
                {error && <p>{error}</p>}

                <h1>Books</h1>
                {books.map(book => (
                    <BookCard key={book.id} book={book}/>
                ))}
            </>
        );
    }
    export default BooksPage;
    