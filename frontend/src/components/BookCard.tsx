import { type Book, type UserBook } from "../types/Book";


interface BookCardProps {
    book: Book;
}

interface UserBookCardProps {
    userbook: UserBook
}

export function BookCard({ book }: BookCardProps) {
    return (
        <p key={book.id}>
            {book.title} <br/> 
            Book ID: {book.id} <br/>
            Book Year: {book.year} <br/>
            Book Author: {book.authors.join(", ")} <br/>
            <br/>
        </p>
    );
}

export function UserBookCard({ userbook }: UserBookCardProps) {
    return (
        <p key={userbook.book_id}>
            {userbook.title} <br/> 
            Book ID: {userbook.book_id} <br/>
            Book Year: {userbook.year} <br/>
            Book Author: {userbook.authors.join(", ")} <br/>
            Book Status: {userbook.status} <br/>
            Book Rating: {userbook.rating} <br/>
            <br/>
        </p>
    );
}