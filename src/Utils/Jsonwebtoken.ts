import jwt from 'jsonwebtoken';
const accessTokenSecret: string = 'MySecretKeyForAccessToken';
const refreshTokenSecret: string = 'MySecretKeyForRefreshToken';


interface User {
  id: number;
  username: string;
  email: string;
  // add any other user fields here
}

export const createAccessToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, accessTokenSecret, { expiresIn: '1d' });
};

export const createRefreshToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, refreshTokenSecret);
};

export const verifyAccessToken = (accessToken: string): User | null => {
  try {
    const payload: any = jwt.verify(accessToken, accessTokenSecret);
    return { id: payload.id, username: payload.username, email: payload.email };
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (refreshToken: string): User | null => {
  try {
    const payload: any = jwt.verify(refreshToken, refreshTokenSecret);
    return { id: payload.id, username: payload.username, email: payload.email };
  } catch (err) {
    return null;
  }
};
