import { useEffect, useState } from 'react';
import './App.css'

interface Book {
    id: number;
    title: string;
    year: number;
    author: string;
  }

function App() {
  
  useEffect(() => {
  const loadBooks = async () => {
    const response = await fetch("http://localhost:3000/books");
    const data = await response.json();
    console.log(data);
    setBooks(data.books);
  };
  loadBooks();
}, []);

  const [books, setBooks] = useState<Book[]>([]);

  return (
    <>
      <h1>Books:</h1>
      {books.map(book => (
        <p key={book.id}>{book.title}</p>
      ))}
    </>
  )
}

export default App
