export type LoginRequestData = {
  userNameOrEmail: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  refreshTokenExpiresOn: Date;
};
