import { useState } from 'react';
import { useNavigate } from 'react-router';
import { addBook } from "../api/books_api.js"

function AddBookPage() {

    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    
    
    const navigate = useNavigate();

    return(
        <>
            {error && <p>{error}</p>}

            <h1>Add book:</h1>

            <form onSubmit={async(e) => {
                e.preventDefault();
                try {

                    await addBook(title);
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
                
                <input type="submit" value="book_data"/>

            </form>
        </>
    );
}

export default AddBookPage;