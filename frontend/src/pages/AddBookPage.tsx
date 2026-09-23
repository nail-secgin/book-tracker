import { useState } from 'react';
import { useNavigate } from 'react-router';
import { addBook } from "../api/books_api.js"

function AddBookPage() {

    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [author, setAuthor] = useState("");
    const [error, setError] = useState("");
    
    
    const navigate = useNavigate();

    return(
        <>
            {error && <p>{error}</p>}

            <h1>Add book:</h1>

            <form onSubmit={async(e) => {
                e.preventDefault();
                try {
                    await addBook(title, Number(year), author);
                    navigate("/books")
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
            
                <input type="submit" value="book_data"/>
            </form>
        </>
    );
}

export default AddBookPage;