export default function errorHandler(error, _req, res, _next) {
  const statusCode = error?.statusCode ?? 500;
  const envelope = {
    success: false,
    error: {
      code: error?.code ?? 'INTERNAL_ERROR',
      message: error?.message ?? 'Error inesperado en la aplicación.',
    },
  };

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json(envelope);
}
