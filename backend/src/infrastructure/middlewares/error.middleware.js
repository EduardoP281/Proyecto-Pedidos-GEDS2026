export default function errorHandler(err, req, res, next) {
    // Map known error cases to HTTP status codes
    let status = 500;
    if (err.statusCode) status = err.statusCode;
    else if (err.name === 'UnauthorizedError') status = 401;
    else if (err.message && err.message.includes('Credenciales')) status = 401;
    else if (err.code === 'ER_DUP_ENTRY') status = 409;
    else if (err.isDomain) status = 400;

    const payload = {
        success: false,
        error: {
            message: err.message || 'Error interno del servidor',
            code: err.code || null
        }
    };

    res.status(status).json(payload);
}
