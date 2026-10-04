import { useEffect, useState } from 'react';
import { UserBookCard} from '../components/BookCard';
import {type UserBook} from "../types/Book.js";
import { getUserBooks } from "../api/books_api.js"
import { Link } from 'react-router';

function LibraryPage() {
        // books uses interface 'Book'
        const [books, setBooks] = useState<UserBook[]>([]);
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);
        
        async function loadUserBooks() {
            try {
                setLoading(true);
                setError("");
                const loaded_books = await getUserBooks();
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
            loadUserBooks();
        }, []);

        return(
            <>
                {error && <p>{error}</p>}
                {loading && <p>Loading</p>}

                <h1>Your Books:</h1>
                {!loading &&(
                    <div>
                        {books.map(book => (
                            <div key={book.userbook_id}>
                                <UserBookCard key={book.userbook_id} userbook={book}/>
                                <Link to={`/user/books/${book.userbook_id}`}> Open details </Link>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
}

export default LibraryPage