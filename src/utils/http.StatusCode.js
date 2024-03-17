const ReasonPhrases = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
    UNAUTHORIZED: 'Unauthorized error',
}

const StatusCode = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
}

module.exports = {
    ReasonPhrases,
    StatusCode
}