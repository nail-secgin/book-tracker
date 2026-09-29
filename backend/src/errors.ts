export class BookNotFoundError extends Error {
    constructor(message = "Book not found") {
        super(message)
        this.name = "BookNotFoundError"
    }
}

export class ExternalApiError extends Error {
    constructor(message = "External API Response invalid") {
        super(message)
        this.name = "ExternalApiError"
    }
}

export class InvalidAuthorDataError extends Error {
    constructor(message = "Author data invalid") {
        super(message)
        this.name = "InvalidAuthorDataError"
    }
}

export class BookDeletionError extends Error {
    constructor(message = "Book deletion failed") {
        super(message)
        this.name = "BookDeletionError"
    }
}