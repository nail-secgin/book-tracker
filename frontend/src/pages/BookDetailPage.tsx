import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

interface Book {
        id: number;
        title: string;
        year: number;
        author: string;
    }

function BookDetailPage() {

    const [book, setBook] = useState<Book>();
    const params = useParams();

    const navigate = useNavigate();

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

            <form onSubmit={async(e) => {
                e.preventDefault();
                await fetch("http://localhost:3000/books/" + params.book_id, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                    },
                });
                navigate("/books")
            }}>

                <input type="submit" value="delete_book"/>
            </form>
            
        </>
    )
}

export default BookDetailPage