import jwt, { JwtPayload } from 'jsonwebtoken';

// generate jwt token
export const generateJwtToken = (
  jwtPayload: { userId: string; userRole: string },
  secret: string,
  expiry: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiry });
};

// verify jwt token
export const verifyJwtToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret) as JwtPayload;
  return verifiedToken;
};
