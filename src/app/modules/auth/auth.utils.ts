import jwt from 'jsonwebtoken';
export const generateJwtToken = (
  jwtPayload: { userId: string; userRole: string },
  secret: string,
  expiry: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiry });
};
