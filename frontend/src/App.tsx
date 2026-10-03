import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import BooksPage from './pages/BooksPage.tsx';
import AddBookPage from './pages/AddBookPage.tsx';
import BookDetailPage from './pages/BookDetailPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import LibraryPage from './pages/LibraryPage.tsx'
import { Link } from 'react-router';

function App() {
  
  return (
    <>
      <BrowserRouter>
      <nav> 
        <Link to="/register"> Register </Link>
        <Link to="/login"> Login </Link>
        <Link to="/books"> Book List </Link>
        <Link to="/books/add"> Add Book </Link>
        <Link to="/library"> Your Library </Link>
        
      </nav>
      
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/books" element={<BooksPage/>}/>
          <Route path="/books/add" element={<AddBookPage/>}/>
          <Route path="/books/:book_id" element={<BookDetailPage/>}/>
          <Route path="/library" element={<LibraryPage/>}/>
        </Routes>
      </BrowserRouter>

      
    </>
  )
}


export default App;
