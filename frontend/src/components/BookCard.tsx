import { type Book } from "../types/Book";


interface BookCardProps {
    book: Book;
}

function BookCard({ book }: BookCardProps) {
    return (
        <p key={book.id}>
            {book.title} <br/> 
            Book ID: {book.id} <br/>
            Book Year: {book.year} <br/>
            Book Author: {book.author} <br/>
            <br/>
        </p>
    );
}

export default BookCard;