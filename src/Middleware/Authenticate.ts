import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../Utils/Jsonwebtoken';
const config = process.env;

const verifyToken = (req: any, res: any, next: any) => {
  const token: any =
    req.body.token || req.query.token || req.headers['x-auth-token'];

  if (!token) {
    return res.status(401).send('A token is required for authentication');
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    if (!req.user) throw 'some error message'
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export { verifyToken };