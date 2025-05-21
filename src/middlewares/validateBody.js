// import createHttpError from 'http-errors';

// export function validateBody(schema) {
//   return async (req, _res, next) => {
//     try {
//       await schema.validateAsync(req.body, {
//         abortEarly: false,
//       });

//       next();
//     } catch (error) {
//       const errors = error.details.map((detail) => detail.message);
//       console.error(errors);
//       next(createHttpError.BadRequest(errors));
//     }
//   };
// }

import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, _res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errorMessages = error.details?.map(detail => detail.message) || ['Invalid input data'];
      next(createHttpError(400, errorMessages.join(', ')));
    }
  };
}
