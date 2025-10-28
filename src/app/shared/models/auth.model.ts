export type LoginRequestData = {
  userNameOrEmail: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  refreshTokenExpiresOn: Date;
  roles: string[];
};

export type JwtPayload = {
  jti: string;
  iat: number;
  sub: string;
  unique_name: string;
  name: string;
  email: string;
  role: string | string[];
  exp: number;
  iss: string;
  aud: string[] | string;
};

export class NotAdminError extends Error {
  constructor() {
    super('You are not an admin');
    this.name = 'NotAdminError';
  }
}

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type ChangeEmailRequest = {
  newEmail: string;
  password: string;
};
