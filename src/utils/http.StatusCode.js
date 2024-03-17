const ReasonPhrases = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'Unauthorized error',
    NOT_FOUND: 'Not found error',
}

const StatusCode = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
}

module.exports = {
    ReasonPhrases,
    StatusCode
}