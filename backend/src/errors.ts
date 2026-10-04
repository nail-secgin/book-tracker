export class BookNotFoundError extends Error {
    constructor(message = "Book not found") {
        super(message)
        this.name = "BookNotFoundError"
    }
}

export class UserBookNotFoundError extends Error {
    constructor(message = "Book not found in user library") {
        super(message)
        this.name = "UserBookNotFoundError"
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

export class UserBookDeletionError extends Error {
    constructor(message = "User Book deletion failed") {
        super(message)
        this.name = "BookDeletionError"
    }
}