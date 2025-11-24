export function validate(schema) {
  return async (req, res, next) => {
    try {
      // Para métodos GET, validar query parameters
      // Para métodos POST/PUT/PATCH, validar body
      // Sempre preservar req.params (não devem ser validados pelo schema)
      
      let dataToValidate;
      let isQuery = false;
      
      if (req.method === 'GET') {
        // GET: validar query parameters
        dataToValidate = req.query;
        isQuery = true;
      } else {
        // POST/PUT/PATCH: validar body
        dataToValidate = req.body;
      }
      
      const validated = await schema.parseAsync(dataToValidate);

      // Atualizar apenas o que foi validado, preservando params
      if (isQuery) {
        req.query = validated;
      } else {
        req.body = validated;
      }
      
      // PRESERVAR req.params sempre (eles são da URL e não devem ser validados)
      // req.params permanece intocado

      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}


