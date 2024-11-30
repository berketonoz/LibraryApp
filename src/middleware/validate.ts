import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateCreateUser(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details);
  next();
}
