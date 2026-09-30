import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type Book }from "../types/Book.js";
import BookCard from '../components/BookCard';
import { deleteBook, getBook } from "../api/books_api.js"

function BookDetailPage() {

    const [book, setBook] = useState<Book>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const params = useParams();

    const navigate = useNavigate();


    // Load book with parameter ID
    async function loadBook() {
        try {
            setLoading(true);
            setError("");
            const loaded_book = await getBook(Number(params.book_id));
            setBook(loaded_book);
        } catch(error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setLoading(false);
        }
    } 

    useEffect(() => {
        loadBook();
     }, []);

    return(
        <>
            {error && <p>{error}</p>}
            {loading && <p>Loading</p>}
            
            <h1>Book:</h1>
            {!loading && book &&(
                <div>
                    <BookCard key={book.id} book={book}/>

                    <form onSubmit={async(e) => {
                        e.preventDefault();
                        try {
                            await deleteBook(book.id)
                            navigate("/books")
                        } catch(error) {
                            if (error instanceof Error) {
                                setError(error.message);
                            }
                        }
                    }}>

                    <input type="submit" value="delete_book"/>
                    </form>
                </div>
            )}
        </>
    )
}

export default BookDetailPage