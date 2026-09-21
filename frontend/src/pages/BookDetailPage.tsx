import { useParams, Route } from 'react-router';
import { useEffect, useState } from 'react';

interface Book {
        id: number;
        title: string;
        year: number;
        author: string;
    }

function BookDetailPage() {

    <Route path="/books/:book_id" element={<BookDetailPage />}/>

    const [book, setBook] = useState<Book>();
    const params = useParams();

    // Load book with parameter ID
    async function loadBook() {
        const response = await fetch("http://localhost:3000/books/" + params.book_id );
        const data = await response.json();
        setBook(data);
    }

    useEffect(() => {
        loadBook();
     }, []);

    return(
        <>
            
            <h1>Book:</h1>
            {book &&(
                <p key={book.id}>
                    {book.title} <br/> 
                    Book ID: {book.id} <br/>
                    Book Year: {book.year} <br/>
                    Book Author: {book.author} <br/>
                    <br/>
                </p>
            )}
        </>
    )
}

export default BookDetailPage