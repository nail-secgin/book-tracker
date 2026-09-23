  import { useEffect, useState } from 'react';
  import BookCard from '../components/BookCard';
  import {type Book} from "../types/Book.js";
  import { getBooks } from "../api/books_api.js"
  import { Link } from 'react-router';

  
    function BooksPage() {
        // books uses interface 'Book'
        const [books, setBooks] = useState<Book[]>([]);
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);
        
        async function loadBooks() {
            try {
                setLoading(true);
                setError("");
                const loaded_books = await getBooks();
                setBooks(loaded_books);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => {
            loadBooks();
        }, []);

        return(
            <>
                {error && <p>{error}</p>}
                {loading && <p>Loading</p>}

                <h1>Books:</h1>
                {!loading &&(
                    <div>
                        {books.map(book => (
                            <div key={book.id}>
                                <BookCard key={book.id} book={book}/>
                                <Link to={`/books/${book.id}`}> Open details </Link>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }
    export default BooksPage;
    