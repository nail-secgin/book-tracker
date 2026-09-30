import { BookNotFoundError, ExternalApiError} from "./errors.js";

// Interface for results in OpenLibrary book-search under '[docs]'
interface OpenLibraryResult {
    key: string,
    title: string,
    author_name?: string[],
    first_publish_year?: number,
    author_key?: string[]
}

// Interface identical to information in database 'book' (+ author and author_key)
export interface Work {
    id: number;
    external_id: string;
    external_source: string;
    title: string;
    year?: number | undefined;
    author?: string[] | undefined;
    author_key?: string[] | undefined;
}

// Interface for OpenLibrary work details
interface WorkDetails {
    key: string,
    description?: string,
    cover?: number[],
    subjects?: string[]
}

// Interface for Author Details
interface AuthorDetails {
    external_id: string,
    external_source: string,
    name: string,
    birthday?: string,
    deathdate?: string,
    bio?: string
}

// External API Request
async function requestExternalApi(url: string) {
    const headers = new Headers({
        "User-Agent": "BookTracker/1.0 (videy987@gmail.com)"
    });

    const options = {
        method: 'GET',
        headers: headers
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new ExternalApiError();
        }
        const response_json = await response.json()
        return response_json
    } catch(error) {
        if (error instanceof ExternalApiError) {
            throw error;
        }

        throw new ExternalApiError();
    }
}

// Get information for a work from external API
async function getWork(work_title: string):Promise<OpenLibraryResult> {
    work_title = encodeURIComponent(work_title)

    const response_json = await requestExternalApi("https://openlibrary.org/search.json?q=" + work_title)
    const first_result = response_json.docs[0];

        if (!first_result) {
            throw new BookNotFoundError();
        }

        const data: OpenLibraryResult = {
            key: first_result.key,
            title: first_result.title,
            author_name: first_result.author_name,
            first_publish_year: first_result.first_publish_year,
            author_key: first_result.author_key
        }
        return data;
} 

export async function getWorkData(book_title: string):Promise<Work> {
    const data = await getWork(book_title);

    const book:Work = {
        id: 0,
        external_id: data.key,
        external_source: "OpenLibrary",
        title: data.title,
        year: data.first_publish_year,
        author: data.author_name,
        author_key: data.author_key
    }
    return book;
}

// Get additional work details from external API
export async function getWorkDetails(work_key: string) {
    const original_work_key = work_key;
    work_key = encodeURIComponent(work_key);

    const response_json = await requestExternalApi("https://openlibrary.org/works/" + work_key + ".json");

    const data: WorkDetails = {
        key: original_work_key,
        description: response_json.description?.value,
        cover: response_json.covers,
        subjects: response_json.subjects
    }
        
    return data;
}

// Get author details with author ID from external API
export async function getAuthorDetails(author_key: string) {
    const original_author_key = author_key;
    author_key = encodeURIComponent(author_key)

    const response_json = await requestExternalApi("https://openlibrary.org/authors/" + author_key + ".json")

    const data: AuthorDetails = {
        external_id: original_author_key,
        external_source: "OpenLibrary",
        name: response_json.name,
        birthday: response_json.birth_date,
        deathdate: response_json.death_date,
        bio: response_json.bio
    }

    return data;
}