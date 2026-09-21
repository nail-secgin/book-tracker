import { useState } from 'react';
import { useNavigate } from 'react-router';

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
                const new_book = {
                    id: Number(id),
                    title: title,
                    year: Number(year),
                    author: author
                };

                const response = await fetch("http://localhost:3000/books", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(new_book)
                });

                if(!response.ok) {
                    const error_info = await response.text();
                    setError(error_info);
                    return;
                }

                navigate("/books")
            }}>
                <label> Book ID </label>
                <input 
                type="number" 
                id="book_id" 
                value={id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setId(e.target.value)}
                /><br/>

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