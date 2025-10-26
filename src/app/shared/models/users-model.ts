export type User = {
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

export type AssignToRoleRequestData = {
  userId: string;
  roles: string[];
};
