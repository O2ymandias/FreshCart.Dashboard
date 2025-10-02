export type UserInfo = {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  pictureUrl?: string;
  roles: string[];
};

export type UsersQueryOptions = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  roleId?: string;
};

export type UsersResponse = {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: UserInfo[];
};

export type AssignToRoleRequestData = {
  userId: string;
  roles: string[];
};
