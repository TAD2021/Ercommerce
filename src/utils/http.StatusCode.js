const ReasonPhrases = {
    UNAUTHORIZED: 'Unauthorized error',
    FORBIDDEN: 'Bad request error',
    NOT_FOUND: 'Not found error',
    CONFLICT: 'Conflict error',
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