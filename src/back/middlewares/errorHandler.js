const errorHandler = (err, req, res, next) => {
  console.error("Ошибка:", err.stack || err);
  res.status(500).json({
    message: 'Внутренняя ошибка сервера',
    error: err.message
  });
};

export default errorHandler;