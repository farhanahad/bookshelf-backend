import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expirationTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expirationTime,
  });
};

// export const createToken = (
//   payload: { phoneNumber: string; role: string; _id: string },
//   secret: Secret,
//   expirationTime: string
// ): string => {
//   return jwt.sign(payload, secret, {
//     expiresIn: expirationTime,
//   });
// };

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = { createToken, verifyToken };
