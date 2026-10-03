export interface Book {
    id: number;
    title: string;
    year: number | null;
    authors: string[];
}

export interface UserBook {
    userbook_id: number;
    book_id: number;
    external_id: string;
    external_source: string;
    title: string;
    year: number | null;
    authors: string[];
    description: string | null
    status: string;
    rating: number | null;
}