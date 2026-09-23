import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type Book }from "../types/Book.js";
import BookCard from '../components/BookCard';
import { deleteBook, getBook, editBook } from "../api/books_api.js"

function BookDetailPage() {

    const [book, setBook] = useState<Book>();
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [author, setAuthor] = useState("");
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
            setTitle(loaded_book.title);
            setYear(String(loaded_book.year));
            setAuthor(loaded_book.author);
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
            
            <form onSubmit={async(e) => {
                e.preventDefault();

                try {
                    await editBook(Number(params.book_id), title, Number(year), author)
                    await loadBook();
                } catch(error) {
                    if (error instanceof Error) {
                        setError(error.message)
                    }
                }
            }}>
                
                {!loading && book &&(
                    <div>
                        <label> Book title </label>
                        <input 
                        type="text" 
                        id="book_title" 
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setTitle(e.target.value)}
                        /><br/>

                        <label> Book publication year </label>
                        <input 
                        type="number" 
                        id="book_year" 
                        value={year}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setYear(e.target.value)}
                        /><br/>

                        <label> Book author </label>
                        <input 
                        type="text" 
                        id="book_author" 
                        value={author}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setAuthor(e.target.value)}
                        /><br/>
                    
                        <input type="submit" value="update_book"/>
                    </div>
                )}
            </form>
           
        </>
    )
}

export default BookDetailPage