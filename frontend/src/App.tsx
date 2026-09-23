import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import BooksPage from './pages/BooksPage.tsx';
import AddBookPage from './pages/AddBookPage.tsx';
import BookDetailPage from './pages/BookDetailPage.tsx';
import { Link } from 'react-router';

function App() {
  
  return (
    <>
      <BrowserRouter>
      <nav> 
        <Link to="/books"> Book List </Link>
        <Link to="/books/add"> Add Book </Link>
      </nav>
      
        <Routes>
          <Route path="/books" element={<BooksPage/>}/>
          <Route path="/books/add" element={<AddBookPage/>}/>
          <Route path="/books/:book_id" element={<BookDetailPage/>}/>
        </Routes>
      </BrowserRouter>

      
    </>
  )
}


export default App;
