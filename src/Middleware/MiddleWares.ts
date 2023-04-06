import express, { Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: any) => {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

const notFound = (req: Request, res: Response, next: any) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
