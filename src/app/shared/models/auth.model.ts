export type LoginRequestData = {
  userNameOrEmail: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  refreshTokenExpiresOn: Date;
};

export type JwtPayload = {
  jti: string;
  iat: number;
  sub: string;
  unique_name: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  iss: string;
  aud: string[] | string;
};
