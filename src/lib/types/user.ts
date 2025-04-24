export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  username: string;
  avatar?: File;
  coverImage?: File;
}
