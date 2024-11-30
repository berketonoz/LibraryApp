import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error.details);
    return;
  }
  next();
}

export function validateCreateBook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error.details);
    return;
  }
  next();
}

export function validateReturnBook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const schema = Joi.object({
    score: Joi.number().required(),
    mode: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error.details);
    return;
  }
  next();
}
