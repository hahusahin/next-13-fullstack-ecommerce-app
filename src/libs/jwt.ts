import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOptions {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: "1h",
};

export const signJWTAccessToken = (
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTIONS
) => {
  const secret_key = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret_key!, options);
  return token;
};

export const verifyJWTToken = (token: string) => {
  try {
    const secret_key = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
