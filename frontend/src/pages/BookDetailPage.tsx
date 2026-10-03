import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type Book }from "../types/Book.js";
import { BookCard } from '../components/BookCard';
import { deleteBook, getBook, addUserBook } from "../api/books_api.js"

function BookDetailPage() {

    type BookStatus = "want_to_read" | "reading" | "read" | "abandoned";

    const [book, setBook] = useState<Book>();
    const [error, setError] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [status, setStatus] = useState<BookStatus | null>(null);
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

                    <form onSubmit={async(e) => {
                        e.preventDefault();
                        try {
                            if (status === null) {
                                throw new Error("No status selected");
                            }
                            await addUserBook(book.id, status, rating);
                            navigate("/library");
                        } catch(error) {
                            if (error instanceof Error) {
                                setError(error.message);
                            }
                        }
                    }}>
                    
                        <label> Rating </label>
                        <input 
                            type="number" 
                            id="rating" 
                            min="1"
                            max="5"
                            step="0.5"
                            value={rating ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setRating(value === "" ? null: Number(value));
                            }}
                        /><br/>

                        <label> Status </label>
                        <select
                            id="status" 
                            value={status ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;

                                if(
                                    value === "want_to_read" ||
                                    value === "reading" ||
                                    value === "read" ||
                                    value === "abandoned"
                                ) {
                                    setStatus(value)
                                }
                            }}
                        >

                            <option value=""> Select </option>
                            <option value="want_to_read"> Want to read </option>
                            <option value="reading"> Reading </option>
                            <option value="read"> Read </option>
                            <option value="abandoned"> Abandoned </option>

                        </select>

                        <br/>
                        <input type="submit" value="add_user_book"/>
                    </form>

                </div>
            )}
        </>
    )
}

export default BookDetailPage