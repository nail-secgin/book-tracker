import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { type Book }from "../types/Book.js";
import BookCard from '../components/BookCard';

function BookDetailPage() {

    const [book, setBook] = useState<Book>();
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [author, setAuthor] = useState("");
    const [error, setError] = useState("");

    const params = useParams();

    const navigate = useNavigate();

    // Load book with parameter ID
    async function loadBook() {
        const response = await fetch("http://localhost:3000/books/" + params.book_id );
        if (!response.ok) {
            const error_info = await response.text();
            setError(error_info);
            return;
        }
        const data = await response.json();
        setBook(data);
        setError("");
    }

    useEffect(() => {
        loadBook();
     }, []);

    return(
        <>
            {error && <p>{error}</p>}
            
            <h1>Book:</h1>
            {book &&(
                <BookCard key={book.id} book={book}/>

            )}

            <form onSubmit={async(e) => {
                e.preventDefault();
                const response = await fetch("http://localhost:3000/books/" + params.book_id, {
                        method: "DELETE",
                });

                if (!response.ok) {
                    const error_info = await response.text();
                    setError(error_info);
                    return;
                }
                
                navigate("/books")
            }}>

                <input type="submit" value="delete_book"/>
            </form>
            
            
            <form onSubmit={async(e) => {
                e.preventDefault();
                const updated_book = {
                    title: title,
                    year: Number(year),
                    author: author
                };
                try {
                    const response = await fetch("http://localhost:3000/books/" + params.book_id, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updated_book)
                        
                    });

                    if(!response.ok) {
                        const error_info = await response.text();
                        setError(error_info);
                        return;
                    }

                    loadBook();
                } catch(error) {
                    if (error instanceof Error) {
                        setError(error.message)
                    }
                }
                }}>

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
            </form>
        </>
    )
}

export default BookDetailPage