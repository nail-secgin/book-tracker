import { useEffect, useState } from 'react';
import './App.css'

// Interface identical to class Book
interface Book {
    id: number;
    title: string;
    year: number;
    author: string;
  }

function App() {
  // books uses interface 'Book' which is identical to class 'Book'
  const [books, setBooks] = useState<Book[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");

  // Function to request all data from /books
  async function loadBooks() {
    // 'await' pauses function and waits for promise
    // 'fetch' requests data from URL and returns a promise
    const response = await fetch("http://localhost:3000/books");
    // 'data' contains JSON data returned by the API, including information of the objects from class 'Book' like 'id' or 'title'
    const data = await response.json();
    setBooks(data.books);
  }

  useEffect(() => {
    loadBooks();
  }, []);



  return (
    <>
    
      <h1>Books:</h1>
      {books.map(book => (
        <p key={book.id}>
          {book.title} <br/> 
          Book ID: {book.id} <br/>
          Book Year: {book.year} <br/>
          Book Author: {book.author} <br/>
          <br/>
        </p>
       
      ))}

      <h1>Add book:</h1>
      <form onSubmit={async(e) => {
        e.preventDefault();
        const new_book = {
            id: Number(id),
            title: title,
            year: Number(year),
            author: author
        };
        await fetch("http://localhost:3000/books", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(new_book)
          });
          loadBooks();
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
  )
}

export default App
